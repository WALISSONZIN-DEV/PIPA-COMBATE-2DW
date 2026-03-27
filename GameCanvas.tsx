import { useRef, useEffect, useCallback } from 'react';
import { PipaCombateEngine } from '@/game/engine';

interface GameCanvasProps {
  onGameOver: (score: number, cuts: number) => void;
  isPlaying: boolean;
}

const GameCanvas = ({ onGameOver, isPlaying }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PipaCombateEngine | null>(null);

  const handleGameOver = useCallback((score: number, cuts: number) => {
    onGameOver(score, cuts);
  }, [onGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (engineRef.current) {
        engineRef.current.resize(canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying) return;

    const engine = new PipaCombateEngine(canvas);
    engine.onGameOver = handleGameOver;
    engineRef.current = engine;

    const handleMouseMove = (e: MouseEvent) => {
      engine.setMousePos(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      engine.setMousePos(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    engine.start();

    return () => {
      engine.stop();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isPlaying, handleGameOver]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full touch-none"
      style={{ cursor: isPlaying ? 'none' : 'default' }}
    />
  );
};

export default GameCanvas;
            
