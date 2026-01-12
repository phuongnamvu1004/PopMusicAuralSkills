import { Play } from 'lucide-react';

interface PlayButtonProps {
  label: string;
  onClick?: () => void;
}

export function PlayButton({ label, onClick }: PlayButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
    >
      <Play className="w-4 h-4" fill="currentColor" />
      {label}
    </button>
  );
}
