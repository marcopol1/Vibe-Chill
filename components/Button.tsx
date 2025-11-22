import React from 'react';
import { audioService } from '../services/audioService';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'valid';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', onClick, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    audioService.playClick();
    if (onClick) onClick(e);
  };

  let baseStyles = "font-mono font-bold uppercase tracking-widest border-4 border-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none px-8 py-4 text-xl md:text-2xl ";
  let colorStyles = "";
  let shadowStyles = "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]";

  switch (variant) {
    case 'primary':
      colorStyles = "bg-acid-green text-black hover:bg-white";
      break;
    case 'valid':
      colorStyles = "bg-electric-blue text-black hover:bg-white";
      break;
    case 'danger':
      colorStyles = "bg-hot-pink text-white hover:bg-red-600";
      break;
    case 'secondary':
      colorStyles = "bg-white text-black hover:bg-gray-100";
      break;
  }

  return (
    <button 
      className={`${baseStyles} ${colorStyles} ${shadowStyles} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};