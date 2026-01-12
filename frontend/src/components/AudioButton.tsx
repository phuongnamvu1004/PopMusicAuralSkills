import { useState } from 'react';
import { Play, Volume2 } from 'lucide-react';

interface AudioButtonProps {
  label: string;
  onPlay: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function AudioButton({ label, onPlay, variant = 'primary', disabled = false }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    if (disabled || isPlaying) return;
    setIsPlaying(true);
    onPlay();
    setTimeout(() => setIsPlaying(false), 1500);
  };

  const baseClasses = "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = variant === 'primary' 
    ? "bg-sky-600 hover:bg-sky-700 text-white"
    : "bg-amber-600 hover:bg-amber-700 text-white";

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isPlaying}
      className={`${baseClasses} ${variantClasses} ${isPlaying ? 'ring-4 ring-sky-300' : ''}`}
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 animate-pulse" />
      ) : (
        <Play className="w-4 h-4" fill="currentColor" />
      )}
      {label}
    </button>
  );
}
