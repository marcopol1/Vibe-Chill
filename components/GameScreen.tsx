import React, { useState, useEffect, useCallback, useRef } from 'react';
import { VibeItem, VibeType } from '../types';
import { VIBE_ITEMS, MAX_TIME_MS, MIN_TIME_MS } from '../constants';
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
  
  const timerRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

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

  const handleChoice = (choice: VibeType) => {
    if (!currentItem) return;

    if (choice === currentItem.type) {
      // Correct
      const newScore = score + 1;
      setScore(newScore);
      audioService.playSuccess();
      
      // Visual Feedback
      setFeedback('W');
      setTimeout(() => setFeedback(null), 300);

      // Increase difficulty: Reduce max time by 50ms every correct answer, down to minimum
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

  // Percentage for progress bar
  const progressPercent = Math.max(0, (timeLeft / maxTimeForRound) * 100);

  if (!currentItem) return <div className="bg-fuchsia-400 h-full w-full"></div>;

  return (
    <div className="flex flex-col h-full w-full bg-fuchsia-400 relative overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-white border-b-4 border-black z-10">
        <div className="font-mono font-bold text-2xl">CLOUT: {score}</div>
        <div className={`font-mono font-bold text-xl ${progressPercent < 30 ? 'text-red-600 animate-pulse' : 'text-black'}`}>
          {(timeLeft / 1000).toFixed(2)}s
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-6 bg-black border-b-4 border-black">
        <div 
          className="h-full bg-acid-green transition-all duration-75 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        
        {/* Feedback Overlay */}
        {feedback && (
          <div className={`absolute inset-0 flex items-center justify-center z-50 pointer-events-none animate-bounce`}>
            <span className={`text-9xl font-black stroke-black text-stroke-3 ${feedback === 'W' ? 'text-green-400' : 'text-red-600'}`}>
              {feedback}
            </span>
          </div>
        )}

        {/* Card */}
        <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-4 max-w-sm w-full animate-shake">
          <div className="text-8xl select-none">{currentItem.emoji}</div>
          <h2 className="text-4xl md:text-5xl font-black font-mono text-center uppercase break-words w-full">
            {currentItem.text}
          </h2>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 grid grid-cols-2 gap-4 bg-white border-t-4 border-black">
        <Button 
          variant="danger" 
          className="h-24 text-xl md:text-3xl"
          onClick={() => handleChoice(VibeType.CRINGE)}
        >
          CRINGE 💀
        </Button>
        <Button 
          variant="valid" 
          className="h-24 text-xl md:text-3xl"
          onClick={() => handleChoice(VibeType.VALID)}
        >
          VALID 🔥
        </Button>
      </div>
    </div>
  );
};