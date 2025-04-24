import React, {useState} from 'react';
import {cn} from '@/lib/utils';
import {Pause, Play} from 'lucide-react';

interface PlayPauseButtonProps {
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  isPlaying?: boolean;
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  className,
  onPlay,
  onPause,
  isPlaying: externalIsPlaying,
}) => {
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const isPlaying = externalIsPlaying ?? internalIsPlaying;

  const handleClick = () => {
    if (isPlaying) {
      onPause?.();
      setInternalIsPlaying(false);
    } else {
      onPlay?.();
      setInternalIsPlaying(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'fixed bottom-8 right-8 z-50',
        'relative w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center',
        'shadow-lg hover:shadow-xl backdrop-blur-sm',
        className
      )}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      <div className="relative w-7 h-7">
        <div
          className={cn(
            'absolute inset-0 transition-all duration-200',
            isPlaying ? 'opacity-0' : 'opacity-100'
          )}
        >
          <Play className="w-full h-full text-white" />
        </div>
        <div
          className={cn(
            'absolute inset-0 transition-all duration-200',
            isPlaying ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Pause className="w-full h-full text-white" />
        </div>
      </div>
    </button>
  );
}; 