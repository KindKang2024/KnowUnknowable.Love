import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {cn} from '@/lib/utils';
import {Pause, Play, Volume2, VolumeX} from 'lucide-react';

// Custom audio player interface
interface CustomAudioPlayerProps {
    // UI Control Props
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    // Control functions
    onPlayPause: () => void;
    onTimeChange: (time: number) => void;
    onVolumeChange: (volume: number) => void;
    onToggleMute: () => void;
    className?: string;
}

// CustomAudioPlayer component ref interface
export interface CustomAudioRef {
    play: () => void;
    pause: () => void;
}

export const CustomPlayerUI = forwardRef<CustomAudioRef, CustomAudioPlayerProps>(({ 
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    onPlayPause,
    onTimeChange,
    onVolumeChange,
    onToggleMute,
    className 
}, ref) => {
    const [showVolumeControl, setShowVolumeControl] = useState(false);
    const volumeControlRef = useRef<HTMLDivElement>(null);
    const volumeButtonRef = useRef<HTMLButtonElement>(null);

    // Expose the play and pause methods through the ref
    useImperativeHandle(ref, () => ({
        play: () => {
            if (!isPlaying) {
                onPlayPause();
            }
        },
        pause: () => {
            if (isPlaying) {
                onPlayPause();
            }
        }
    }));

    // Handle clicks outside volume control
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                showVolumeControl && 
                volumeControlRef.current && 
                volumeButtonRef.current && 
                !volumeControlRef.current.contains(event.target as Node) &&
                !volumeButtonRef.current.contains(event.target as Node)
            ) {
                setShowVolumeControl(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showVolumeControl]);

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        onTimeChange(newTime);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        onVolumeChange(newVolume);

        // Automatically toggle mute based on volume slider
        if (newVolume <= 0.05 && !isMuted) { // Threshold to account for slider precision
            onToggleMute(); // Mute if volume is dragged to near zero
        } else if (newVolume > 0.05 && isMuted) {
            onToggleMute(); // Unmute if volume is dragged up from zero
        }
    };

    const toggleVolumeControl = () => {
        setShowVolumeControl(!showVolumeControl);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Calculate progress percentage for the progress bar
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className={cn("flex flex-col", className)}>
            <div className="flex items-center gap-2">
                <button 
                    onClick={onPlayPause} 
                    className="text-yellow-500 hover:text-yellow-400 transition-colors"
                >
                    {isPlaying ? 
                        <Pause size={20} className="fill-yellow-500" /> : 
                        <Play size={20} className="fill-yellow-500" />}
                </button>
                
                <span className="text-xs text-yellow-500/70 min-w-[35px]">{formatTime(currentTime)}</span>
                
                <div className="flex-1 relative h-1 bg-gray-700/50 rounded-full overflow-hidden">
                    <div 
                        className="absolute h-full bg-yellow-500 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    />
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleTimeChange}
                        className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
                
                <span className="text-xs text-yellow-500/70 min-w-[35px] text-right">{formatTime(duration)}</span>
                
                <div className="relative">
                    <button 
                        ref={volumeButtonRef}
                        onClick={toggleVolumeControl}
                        className="text-yellow-500/80 hover:text-yellow-400 transition-colors"
                    >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    
                    {showVolumeControl && (
                        <div 
                            ref={volumeControlRef}
                            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black border border-yellow-500/20 rounded-md p-2 shadow-md flex flex-col items-center"
                        >
                            <div className="h-20 w-2 bg-gray-700/50 rounded-full relative">
                                <div 
                                    className="absolute bottom-0 w-full bg-yellow-500 rounded-full"
                                    style={{ 
                                        height: `${volume * 100}%`,
                                        opacity: isMuted ? 0.3 : 1 
                                    }}
                                ></div>
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    style={{
                                        WebkitAppearance: 'slider-vertical',
                                        writingMode: 'vertical-lr' as any,
                                        transform: 'rotate(180deg)'
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
