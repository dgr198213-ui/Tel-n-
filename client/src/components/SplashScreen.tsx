import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isHidden, setIsHidden] = useState(false);

  // Check if splash screen has already been shown in this session
  useEffect(() => {
    const splashShown = sessionStorage.getItem('telon-splash-shown');
    if (splashShown) {
      setIsHidden(true);
      onComplete?.();
    }
  }, [onComplete]);

  const handleInitialize = () => {
    sessionStorage.setItem('telon-splash-shown', 'true');
    setIsHidden(true);
    setTimeout(() => {
      onComplete?.();
    }, 800);
  };

  if (isHidden) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#0A0A0D] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-800 ${
        isHidden ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
      style={{
        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)',
      }}
    >
      {/* Curtain Texture Overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)',
        }}
      />

      {/* Content */}
      <div className="z-10 flex flex-col items-center gap-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground text-glow">
          TELÓN
        </h1>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Sistema Offline
        </p>

        {/* Initialize Button */}
        <button
          onClick={handleInitialize}
          className="mt-8 relative group"
        >
          <div className="absolute inset-0 bg-primary-container opacity-20 group-hover:opacity-40 blur-md transition-opacity duration-300 rounded-full" />
          <div className="relative tech-border bg-card hover:bg-muted rounded-full px-8 py-4 flex items-center gap-3 transition-all duration-200 group-active:scale-95">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs text-primary uppercase tracking-widest">
              Inicializar Consola
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
