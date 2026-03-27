interface GameOverScreenProps {
  score: number;
  cuts: number;
  onRestart: () => void;
  onMenu: () => void;
}

const GameOverScreen = ({ score, cuts, onRestart, onMenu }: GameOverScreenProps) => {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
    >
      <div className="text-center px-8 py-10 rounded-2xl mx-4 max-w-sm w-full"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 54, 93, 0.95), rgba(43, 108, 176, 0.95))',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        <h2 className="font-display text-4xl sm:text-5xl tracking-wide"
          style={{ color: '#fc8181' }}
        >
          LINHA CORTADA!
        </h2>

        <div className="mt-6 space-y-3">
          <div className="rounded-xl py-3 px-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <p className="font-body text-sm opacity-70" style={{ color: '#e2e8f0' }}>PONTOS</p>
            <p className="font-display text-4xl" style={{ color: '#faf089' }}>{score}</p>
          </div>
          <div className="rounded-xl py-3 px-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <p className="font-body text-sm opacity-70" style={{ color: '#e2e8f0' }}>PIPAS CORTADAS</p>
            <p className="font-display text-4xl" style={{ color: '#68d391' }}>{cuts}</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-xl font-display text-xl tracking-wide
              transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #e53e3e, #c53030)',
              color: '#ffffff',
              boxShadow: '0 6px 20px rgba(229, 62, 62, 0.4)',
            }}
          >
            JOGAR DE NOVO
          </button>
          <button
            onClick={onMenu}
            className="w-full py-3 rounded-xl font-display text-xl tracking-wide
              transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#e2e8f0',
            }}
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
              
