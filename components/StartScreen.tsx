import React from 'react';
import { Button } from './Button';
import { DEVELOPER_NAME } from '../constants';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-yellow-300 p-4 relative overflow-hidden">
       {/* Background decoration */}
       <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent"></div>

      <div className="z-10 flex flex-col items-center gap-8 max-w-md w-full">
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-[-2deg]">
          <h1 className="text-5xl md:text-7xl font-black font-mono uppercase tracking-tighter text-center leading-tight">
            VIBE<br />CHECK
          </h1>
        </div>

        <div className="bg-black text-acid-green p-2 font-mono text-sm border-2 border-acid-green animate-pulse">
           DEV: {DEVELOPER_NAME}
        </div>

        <div className="flex flex-col gap-2 text-center font-mono font-bold border-4 border-black bg-white p-4 w-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="uppercase text-lg bg-hot-pink text-white inline-block px-2 transform -skew-x-12 w-max mx-auto mb-2">Mission</p>
          <p>Sort the trends.</p>
          <p>Left = <span className="text-red-600">CRINGE</span></p>
          <p>Right = <span className="text-blue-600">VALID</span></p>
          <p className="text-xs mt-2 text-gray-500">Don't let the timer hit zero.</p>
        </div>

        {highScore > 0 && (
           <div className="font-mono font-bold text-xl">
             HIGH CLOUT: {highScore}
           </div>
        )}

        <Button onClick={onStart} className="w-full animate-bounce">
          START THE VIBE
        </Button>
      </div>
    </div>
  );
};