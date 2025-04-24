import React, {useEffect, useRef, useState} from 'react';
import {Volume2, VolumeOff} from 'lucide-react';
import {Howl} from 'howler';
import {useLocation} from 'react-router-dom';
import {cn} from '@/lib/utils';

const BgmMusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const soundRef = useRef<Howl | null>(null);
    const location = useLocation();
    const hidePlayer = location.pathname.includes('/divi');

    const tracks = [
        {
            name: "Siberiade Theme2",
            url: "/VoyagerGoldenRecords/028.mp3",
        },
        {
            name: "Harmony",
            url: "/sounds/harmony.mp3",
        }
    ];

    useEffect(() => {
        // Initialize first track
        soundRef.current = new Howl({
            src: [tracks[0].url],
            loop: true,
            volume: 0,
            onend: () => {
                console.log('Finished playing!');
            },
            onloaderror: (id, error) => {
                console.error('Error loading audio:', error);
            }
        });

        return () => {
            if (soundRef.current) {
                soundRef.current.unload();
            }
        };
    }, []);

    const togglePlay = () => {
        if (!soundRef.current) return;

        if (isPlaying) {
            // Fade out then stop
            soundRef.current.fade(soundRef.current.volume(), 0, 1000);
            setTimeout(() => {
                soundRef.current?.pause();
            }, 1000);
        } else {
            soundRef.current.play();
            soundRef.current.fade(0, 0.5, 1000);
        }
        setIsPlaying(!isPlaying);
    };

    const changeTrack = async (index: number) => {
        // if index is the same as the current track, do nothing
        if (index === currentTrack && isPlaying) return;

        // Fade out current track
        if (soundRef.current) {
            if (isPlaying) {
                soundRef.current.fade(soundRef.current.volume(), 0, 1000);
            }
            await new Promise(resolve => setTimeout(resolve, 300));
            soundRef.current.unload();
        }

        // Create and play new track
        soundRef.current = new Howl({
            src: [tracks[index].url],
            loop: true,
            volume: 0
        });

        setCurrentTrack(index);
        
        if (isPlaying || hidePlayer) {
            soundRef.current.play();
            soundRef.current.fade(0, 0.5, 1000);
        }
    };

    useEffect(() => {
        const handleRouteChange = async () => {
            const path = location.pathname;
             if (path.includes('/divi')) {
                await changeTrack(1);
            } else {
                await changeTrack(0);
            }
        };
        handleRouteChange();
    }, [location]);

    const handleClick = () => {
        togglePlay();
    };

    const playerStyle = { 
        position: 'fixed', 
        bottom: '3.6rem', 
        right: '2rem', 
        zIndex: 50,
        transform: 'translateZ(0)'
    } as React.CSSProperties;

    if (hidePlayer) {
        return null;
    }

    return (
        <div style={playerStyle}>
            <div className="transform transition-all duration-300 ease-out">
                <div className="flex items-start">
                    <div className="relative">
                        <button
                            onClick={handleClick}
                            className={cn(
                                'w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center',
                                'shadow-lg hover:shadow-xl backdrop-blur-sm relative z-10',
                            )}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            <div className="relative w-7 h-7 flex items-center justify-center">
                                {isPlaying ? (
                                    <Volume2 className="w-full h-full text-white" />
                                ) : (
                                    <VolumeOff className="w-full h-full text-white" />
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BgmMusicPlayer;