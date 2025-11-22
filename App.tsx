import React, { useState } from 'react';
import { GameState } from './types';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { audioService } from './services/audioService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [lastScore, setLastScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleStartGame = async () => {
    await audioService.startContext();
    audioService.playStart();
    setGameState(GameState.PLAYING);
  };

  const handleGameOver = (score: number) => {
    setLastScore(score);
    if (score > highScore) {
      setHighScore(score);
    }
    setGameState(GameState.GAME_OVER);
  };

  const handleRestart = () => {
    audioService.playClick();
    setGameState(GameState.START); // Go back to start for flow, or could go directly to playing
  };

  return (
    <div className="w-full h-screen overflow-hidden flex items-center justify-center font-sans select-none">
      <div className="scanline"></div>
      
      {/* Container to constrain max width on desktop but fill mobile */}
      <div className="w-full h-full md:max-w-lg md:h-[90vh] md:border-8 md:border-black md:shadow-[20px_20px_0px_0px_rgba(0,0,0,0.5)] bg-white relative">
        {gameState === GameState.START && (
          <StartScreen onStart={handleStartGame} highScore={highScore} />
        )}
        {gameState === GameState.PLAYING && (
          <GameScreen onGameOver={handleGameOver} />
        )}
        {gameState === GameState.GAME_OVER && (
          <GameOverScreen score={lastScore} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
};

export default App;