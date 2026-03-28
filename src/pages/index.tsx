import { useState, useCallback } from 'react';
import { GameState } from '@/game/types';
import GameCanvas from '@/components/GameCanvas';
import MenuScreen from '@/components/MenuScreen';
import GameOverScreen from '@/components/GameOverScreen';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [finalScore, setFinalScore] = useState(0);
  const [finalCuts, setFinalCuts] = useState(0);

  const handleStart = useCallback(() => {
    setGameState('playing');
  }, []);

  const handleGameOver = useCallback((score: number, cuts: number) => {
    setFinalScore(score);
    setFinalCuts(cuts);
    setGameState('gameover');
  }, []);

  const handleRestart = useCallback(() => {
    setGameState('menu');
    // Small delay to remount canvas
    setTimeout(() => setGameState('playing'), 50);
  }, []);

  const handleMenu = useCallback(() => {
    setGameState('menu');
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden">
      <GameCanvas
        isPlaying={gameState === 'playing'}
        onGameOver={handleGameOver}
      />

      {gameState === 'menu' && <MenuScreen onStart={handleStart} />}

      {gameState === 'gameover' && (
        <GameOverScreen
          score={finalScore}
          cuts={finalCuts}
          onRestart={handleRestart}
          onMenu={handleMenu}
        />
      )}
    </div>
  );
};

export default Index;

