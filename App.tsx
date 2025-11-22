
import React, { useState, useEffect } from 'react';
import { GameState, LeaderboardEntry } from './types';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { audioService } from './services/audioService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [lastScore, setLastScore] = useState(0);
  const [currentNickname, setCurrentNickname] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totalGames, setTotalGames] = useState(0);

  // Load data from local storage on mount
  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('vibeCheckLeaderboard');
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }

    const savedNickname = localStorage.getItem('vibeCheckNickname');
    if (savedNickname) {
      setCurrentNickname(savedNickname);
    }

    const savedTotalGames = localStorage.getItem('vibeCheckTotalGames');
    if (savedTotalGames) {
      setTotalGames(parseInt(savedTotalGames, 10));
    }
  }, []);

  // Save leaderboard whenever it changes
  useEffect(() => {
    localStorage.setItem('vibeCheckLeaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  const handleStartGame = async (nickname: string) => {
    // If we don't have a nickname yet (first time), save it
    if (!currentNickname) {
      setCurrentNickname(nickname);
      localStorage.setItem('vibeCheckNickname', nickname);
    }

    await audioService.startContext();
    audioService.playStart();
    audioService.startBGM(); // Start the light background music
    setGameState(GameState.PLAYING);
  };

  const handleGameOver = (score: number) => {
    setLastScore(score);
    
    // Update Leaderboard
    const newEntry: LeaderboardEntry = {
      name: currentNickname,
      score: score,
      timestamp: Date.now()
    };

    const newLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score) // Sort descending
      .slice(0, 5); // Keep top 5

    setLeaderboard(newLeaderboard);
    
    // Update Total Games
    const newTotal = totalGames + 1;
    setTotalGames(newTotal);
    localStorage.setItem('vibeCheckTotalGames', newTotal.toString());

    setGameState(GameState.GAME_OVER);
  };

  const handleRestart = () => {
    audioService.playClick();
    setGameState(GameState.START); 
  };

  // Get user's high score for display context
  const userHighScore = leaderboard.find(l => l.name === currentNickname)?.score || 0;
  // Fallback global high score if user not found or just for comparison
  const globalHighScore = leaderboard.length > 0 ? leaderboard[0].score : 0;

  return (
    <div className="w-full h-screen overflow-hidden flex items-center justify-center font-sans select-none bg-gray-900">
      <div className="scanline"></div>
      
      {/* Container */}
      <div className="w-full h-full md:max-w-lg md:h-[90vh] md:border-8 md:border-black md:shadow-[20px_20px_0px_0px_rgba(0,255,255,0.2)] bg-white relative flex flex-col">
        {gameState === GameState.START && (
          <StartScreen 
            onStart={handleStartGame} 
            leaderboard={leaderboard} 
            initialNickname={currentNickname}
            totalGames={totalGames}
          />
        )}
        {gameState === GameState.PLAYING && (
          <GameScreen onGameOver={handleGameOver} />
        )}
        {gameState === GameState.GAME_OVER && (
          <GameOverScreen score={lastScore} highScore={globalHighScore} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
};

export default App;
