import React from 'react';
import { Button } from './Button';
import { DEVELOPER_NAME } from '../constants';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart }) => {
  const getRank = (s: number) => {
    if (s < 5) return "NPC Energy";
    if (s < 15) return "Trying too hard";
    if (s < 30) return "Valid";
    return "Main Character Energy";
  };

  const isNewHigh = score >= highScore && score > 0;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-red-500 p-4 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-noise.png')] opacity-20"></div>
        
        <div className="z-10 flex flex-col items-center gap-6 max-w-md w-full">
            <div className="bg-black text-white border-4 border-white p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] w-full text-center relative overflow-hidden">
                
                {isNewHigh && (
                    <div className="absolute top-0 left-0 w-full bg-acid-green text-black font-bold font-mono animate-pulse">
                        GOAT STATUS REACHED!
                    </div>
                )}

                <h1 className="text-6xl font-black font-mono text-hot-pink mb-2 mt-4">RATIO'D</h1>
                <p className="font-mono text-white uppercase tracking-widest mb-6">Vibe Check Failed</p>
                
                <div className="border-t-2 border-white my-4"></div>
                
                <div className="flex flex-col gap-2">
                    <span className="text-xl text-gray-400 font-mono">FINAL CLOUT</span>
                    <span className="text-5xl font-bold text-acid-green">{score}</span>
                </div>

                 <div className="flex flex-col gap-0 mt-4">
                    <span className="text-sm text-gray-400 font-mono">SERVER RECORD</span>
                    <span className="text-2xl font-bold text-white">{highScore}</span>
                </div>

                <div className="mt-6 bg-gray-800 p-2 border-2 border-gray-600">
                    <span className="text-electric-blue font-mono uppercase text-sm block">Rank</span>
                    <span className="text-white font-mono font-bold text-lg">{getRank(score)}</span>
                </div>
            </div>

            <Button onClick={onRestart} className="w-full">
                RUN IT BACK
            </Button>

             <div className="text-white font-mono text-xs mt-8 opacity-70">
                 Created by {DEVELOPER_NAME}
             </div>
        </div>
    </div>
  );
};