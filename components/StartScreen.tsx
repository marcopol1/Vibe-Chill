
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { DEVELOPER_NAME, DAILY_VIBES } from '../constants';
import { LeaderboardEntry } from '../types';
import { audioService } from '../services/audioService';

interface StartScreenProps {
  onStart: (nickname: string) => void;
  leaderboard: LeaderboardEntry[];
  initialNickname?: string;
  totalGames: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, leaderboard, initialNickname, totalGames }) => {
  const [nickname, setNickname] = useState(initialNickname || '');
  const [error, setError] = useState(false);
  const [dailyVibe, setDailyVibe] = useState('');
  const [isMuted, setIsMuted] = useState(audioService.getMuteState());

  useEffect(() => {
    // Pick a random daily vibe on mount
    const randomVibe = DAILY_VIBES[Math.floor(Math.random() * DAILY_VIBES.length)];
    setDailyVibe(randomVibe);
  }, []);

  const handleStart = () => {
    if (!nickname.trim()) {
      setError(true);
      return;
    }
    onStart(nickname.trim());
  };

  const toggleSound = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
  };

  const isReturningUser = !!initialNickname;

  return (
    <div className="flex flex-col h-full w-full bg-zinc-100 relative overflow-y-auto overflow-x-hidden scrollbar-hide">
       {/* Animated Gradient BG */}
       <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-200 animate-pulse-fast opacity-20 pointer-events-none"></div>
       <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center gap-4 w-full max-w-md mx-auto py-6 px-4">
        
        {/* Settings / Top Bar */}
        <div className="w-full flex justify-end items-center mb-2">
           <button onClick={toggleSound} className="font-mono text-xs border-2 border-black bg-white text-red-600 font-bold px-2 py-1 hover:bg-gray-200 uppercase">
             AUDIO: {isMuted ? 'OFF' : 'ON'}
           </button>
        </div>

        {/* Header Section */}
        <div className="relative group cursor-default transform hover:scale-105 transition-transform duration-300">
          <div className="absolute -inset-2 bg-black rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
          <div className="relative bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            <h1 className="text-5xl md:text-6xl font-black font-mono uppercase tracking-tighter text-center leading-none bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              VIBE<br />CHECK
            </h1>
          </div>
        </div>

        {/* Cool Visual - Gaming Style */}
        <div className="relative w-full aspect-video overflow-hidden border-4 border-black shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] bg-black group">
            <img 
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80" 
                alt="Retro Gaming Arcade" 
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 contrast-125 brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-2 left-2 bg-acid-green text-black font-mono text-xs px-2 py-1 font-bold border-2 border-black rotate-2">
                DAILY VIBE: {dailyVibe}
            </div>
        </div>

        {/* Nickname Input Logic */}
        <div className="w-full flex flex-col gap-2">
            
            {isReturningUser ? (
                <div className="relative bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="block text-xs font-mono text-gray-500 uppercase">User</span>
                            <span className="font-mono text-2xl font-black text-red-600 uppercase tracking-wide">
                                {nickname}
                            </span>
                        </div>
                         <div className="text-right">
                            <span className="block text-xs font-mono text-gray-500 uppercase">Checks</span>
                            <span className="font-mono text-xl font-bold text-black">
                                {totalGames}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                <div className="relative">
                    <input 
                        type="text" 
                        maxLength={10}
                        placeholder="ENTER ALIAS..." 
                        value={nickname}
                        onChange={(e) => {
                            setNickname(e.target.value);
                            setError(false);
                        }}
                        className={`w-full bg-white text-red-600 placeholder-red-200 border-4 ${error ? 'border-red-500 animate-shake' : 'border-black focus:border-electric-blue'} p-4 font-mono text-xl font-black outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] uppercase tracking-wide`}
                    />
                </div>
                {error && <span className="text-red-600 font-mono text-xs font-bold">REQUIRED FIELD *</span>}
                </>
            )}
        </div>

        <Button onClick={handleStart} className="w-full bg-acid-green hover:bg-acid-green/80 relative overflow-hidden group py-6">
          <span className="relative z-10 text-2xl">INITIATE CHECK</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </Button>

        {/* Leaderboard / Wall of Goats */}
        <div className="w-full bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 mt-2 flex-1 min-h-[150px]">
            <div className="flex justify-between items-center mb-3 border-b-4 border-black pb-1">
                <h2 className="font-black font-mono text-lg uppercase">Wall of Goats</h2>
                <span className="text-[10px] font-mono bg-black text-white px-1 rounded">TOP 5</span>
            </div>
            
            {leaderboard.length === 0 ? (
                <div className="text-center font-mono text-gray-400 py-4 italic text-sm">No vibes detected yet.</div>
            ) : (
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[120px] scrollbar-hide">
                    {leaderboard.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center font-mono border-b border-gray-100 last:border-0 pb-1">
                            <div className="flex gap-2 items-center">
                                <span className={`font-bold text-sm ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-700' : 'text-black'}`}>
                                    #{index + 1}
                                </span>
                                <span className="uppercase truncate max-w-[100px] text-sm font-bold">{entry.name}</span>
                            </div>
                            <span className="font-black text-hot-pink text-sm">{entry.score}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="text-center mt-4 mb-2">
           <span className="bg-black text-white px-2 py-1 text-[10px] font-mono -rotate-1 inline-block">
             DEV: {DEVELOPER_NAME}
           </span>
        </div>
      </div>
    </div>
  );
};
