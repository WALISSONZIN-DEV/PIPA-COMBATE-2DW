interface MenuScreenProps {
  onStart: () => void;
}

const MenuScreen = ({ onStart }: MenuScreenProps) => {
  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #1a365d 0%, #2b6cb0 40%, #4299e1 70%, #90cdf4 100%)',
      }}
    >
      {/* Decorative kites in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[15%] animate-float" style={{ animationDelay: '0s' }}>
          <KiteIcon color="#e53e3e" size={40} />
        </div>
        <div className="absolute top-[25%] right-[20%] animate-float" style={{ animationDelay: '0.5s' }}>
          <KiteIcon color="#38a169" size={35} />
        </div>
        <div className="absolute top-[10%] right-[35%] animate-float" style={{ animationDelay: '1s' }}>
          <KiteIcon color="#ecc94b" size={30} />
        </div>
        <div className="absolute bottom-[30%] left-[10%] animate-float" style={{ animationDelay: '1.5s' }}>
          <KiteIcon color="#805ad5" size={28} />
        </div>
        <div className="absolute bottom-[40%] right-[12%] animate-float" style={{ animationDelay: '0.7s' }}>
          <KiteIcon color="#dd6b20" size={32} />
        </div>
      </div>

      {/* Title */}
      <div className="relative z-10 text-center px-6">
        <h1 className="font-display text-6xl sm:text-8xl tracking-wider text-shadow-glow"
          style={{ color: '#faf089' }}
        >
          PIPA
        </h1>
        <h1 className="font-display text-5xl sm:text-7xl tracking-wider -mt-2"
          style={{ color: '#ffffff' }}
        >
          COMBATE
        </h1>

        <p className="font-body text-base sm:text-lg mt-4 opacity-80"
          style={{ color: '#e2e8f0' }}
        >
          Mova sua pipa e corte a linha dos oponentes!
        </p>

        <button
          onClick={onStart}
          className="mt-8 px-10 py-4 rounded-xl font-display text-2xl sm:text-3xl tracking-wide
            transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #e53e3e, #c53030)',
            color: '#ffffff',
            boxShadow: '0 8px 30px rgba(229, 62, 62, 0.5)',
          }}
        >
          JOGAR
        </button>

        <div className="mt-6 space-y-1">
          <p className="font-body text-sm opacity-60" style={{ color: '#e2e8f0' }}>
            🖱️ Mouse ou ☝️ Touch para controlar
          </p>
          <p className="font-body text-sm opacity-60" style={{ color: '#e2e8f0' }}>
            Cruze com as pipas inimigas para cortar!
          </p>
        </div>
      </div>
    </div>
  );
};

function KiteIcon({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 50" fill="none">
      <path d="M20 0 L35 18 L20 30 L5 18 Z" fill={color} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <line x1="20" y1="0" x2="20" y2="30" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <line x1="5" y1="18" x2="35" y2="18" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <path d="M20 30 Q 15 38 20 45 Q 25 38 20 30" stroke={color} fill="none" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}

export default MenuScreen;
  
