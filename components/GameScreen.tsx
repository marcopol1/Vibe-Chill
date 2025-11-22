
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { VibeItem, VibeType } from '../types';
import { VIBE_ITEMS, MAX_TIME_MS, MIN_TIME_MS, GAME_BACKGROUNDS } from '../constants';
import { Button } from './Button';
import { audioService } from '../services/audioService';

interface GameScreenProps {
  onGameOver: (score: number) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const [score, setScore] = useState(0);
  const [currentItem, setCurrentItem] = useState<VibeItem | null>(null);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME_MS);
  const [maxTimeForRound, setMaxTimeForRound] = useState(MAX_TIME_MS);
  const [feedback, setFeedback] = useState<'W' | 'L' | null>(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [vibeShift, setVibeShift] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Initialize random background
  useEffect(() => {
    setBgIndex(Math.floor(Math.random() * GAME_BACKGROUNDS.length));
  }, []);

  // Select random item
  const nextItem = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * VIBE_ITEMS.length);
    const itemBase = VIBE_ITEMS[randomIndex];
    setCurrentItem({ ...itemBase, id: Math.random().toString(36).substr(2, 9) });
  }, []);

  // Game Loop
  useEffect(() => {
    nextItem();
    lastTimeRef.current = Date.now();
    
    const loop = () => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      setTimeLeft((prev) => {
        const newTime = prev - delta;
        if (newTime <= 0) {
           // Time ran out
           handleGameOver();
           return 0;
        }
        return newTime;
      });

      timerRef.current = requestAnimationFrame(loop);
    };

    timerRef.current = requestAnimationFrame(loop);

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGameOver = () => {
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    audioService.playFailure();
    onGameOver(score);
  };

  const changeVibe = () => {
    setVibeShift(true);
    // Change background to a new random one different from current
    setBgIndex(prev => {
        let newIndex = Math.floor(Math.random() * GAME_BACKGROUNDS.length);
        while (newIndex === prev) {
             newIndex = Math.floor(Math.random() * GAME_BACKGROUNDS.length);
        }
        return newIndex;
    });
    setTimeout(() => setVibeShift(false), 1000);
  };

  const handleChoice = (choice: VibeType) => {
    if (!currentItem) return;

    if (choice === currentItem.type) {
      // Correct
      const newScore = score + 1;
      setScore(newScore);
      setCombo(prev => prev + 1);
      audioService.playSuccess();
      
      // Visual Feedback
      setFeedback('W');
      setTimeout(() => setFeedback(null), 300);

      // Vibe Shift every 5 points
      if (newScore % 5 === 0) {
        changeVibe();
      }

      // Increase difficulty
      const newMaxTime = Math.max(MIN_TIME_MS, MAX_TIME_MS - (newScore * 50));
      setMaxTimeForRound(newMaxTime);
      setTimeLeft(newMaxTime);
      
      nextItem();
    } else {
      // Wrong
      setFeedback('L');
      handleGameOver();
    }
  };

  const progressPercent = Math.max(0, (timeLeft / maxTimeForRound) * 100);

  if (!currentItem) return <div className="bg-black h-full w-full"></div>;

  return (
    <div className="flex flex-col h-full w-full bg-black relative overflow-hidden">
      
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out">
         <img 
            src={GAME_BACKGROUNDS[bgIndex]} 
            alt="bg" 
            className="w-full h-full object-cover opacity-60"
         />
         {/* Overlay pattern */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/3px-tile.png')] opacity-50"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
      </div>

      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 z-20 bg-black/80 backdrop-blur-sm border-b-2 border-white/20">
        <div className="flex flex-col">
            <div className="font-mono font-bold text-2xl text-white drop-shadow-[0_2px_0_rgba(0,0,0,1)]">CLOUT: {score}</div>
            {combo > 1 && (
                <div className="text-acid-green font-mono text-xs font-bold animate-pulse">
                    STREAK x{combo} 🔥
                </div>
            )}
        </div>
        <div className={`font-mono font-bold text-xl ${progressPercent < 30 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
          {(timeLeft / 1000).toFixed(2)}s
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-4 bg-black/50 z-20">
        <div 
          className={`h-full transition-all duration-75 ease-linear ${progressPercent < 30 ? 'bg-red-500' : 'bg-acid-green'}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Vibe Shift Overlay */}
      {vibeShift && (
        <div className="absolute top-20 w-full text-center z-30 animate-pulse pointer-events-none">
            <span className="bg-black text-electric-blue px-4 py-1 font-black font-mono text-2xl uppercase -rotate-2 inline-block border-2 border-electric-blue">
                VIBE SHIFT DETECTED
            </span>
        </div>
      )}

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        
        {/* Feedback Overlay */}
        {feedback && (
          <div className={`absolute inset-0 flex items-center justify-center z-50 pointer-events-none`}>
             <div className={`text-9xl font-black stroke-black text-stroke-3 animate-bounce transform transition-all duration-75 ${feedback === 'W' ? 'text-acid-green scale-125' : 'text-red-600 rotate-12'}`}>
              {feedback}
             </div>
          </div>
        )}

        {/* Game Card - Glassmorphism */}
        <div className="backdrop-blur-xl bg-white/80 border-4 border-white/50 p-8 md:p-12 shadow-[0_0_40px_rgba(255,255,255,0.2)] rounded-xl flex flex-col items-center gap-4 max-w-sm w-full animate-shake transform transition-transform duration-100">
          <div className="text-8xl select-none filter drop-shadow-lg transform hover:scale-110 transition-transform cursor-default">
            {currentItem.emoji}
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-mono text-center uppercase break-words w-full text-black drop-shadow-sm">
            {currentItem.text}
          </h2>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 grid grid-cols-2 gap-4 bg-black/80 backdrop-blur-md border-t-2 border-white/20 z-20">
        <Button 
          variant="danger" 
          className="h-20 md:h-24 text-xl md:text-3xl border-none shadow-lg active:scale-95 transition-transform"
          onClick={() => handleChoice(VibeType.CRINGE)}
        >
          CRINGE 💀
        </Button>
        <Button 
          variant="valid" 
          className="h-20 md:h-24 text-xl md:text-3xl border-none shadow-lg active:scale-95 transition-transform"
          onClick={() => handleChoice(VibeType.VALID)}
        >
          VALID 🔥
        </Button>
      </div>
    </div>
  );
};
