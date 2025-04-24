import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AlertCircle, ExternalLink, Info, PictureInPicture, X} from 'lucide-react';
import {cn} from '@/lib/utils';
import {usePageCommonData} from '@/i18n/DataProvider';
import {Image} from '@/i18n/data_types';
import {CustomAudioRef, CustomPlayerUI} from "@/components/CustomPlayerUI";

import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,} from "@/components/ui/carousel";

const VoyagerGoldenRecordsPlayer: React.FC = () => {
    const [playerState, setPlayerState] = useState<'collapsed' | 'expanded'>('collapsed');
    const [isPlaying, setIsPlaying] = useState(false);
    const pageCommonData = usePageCommonData();
    const { tracks = [], images = [] } = pageCommonData.voyager || {};

    const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
    const [isSeeking, setIsSeeking] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);

    const audioPlayerUIRef = useRef<CustomAudioRef>(null);

    const playTrack = useCallback((index: number) => {
        const track = tracks[index];
        if (!audioRef.current || !track || !track.low_copyright_risk) {
            console.error(`Cannot play track index ${index}: Invalid or No Audio Ref or Copyrighted`);
            return;
        }
        console.log(`playTrack: Playing index ${index}: ${track.title}`);

        setCurrentTrackIndex(index);
        const paddedTrackNumber = track.track_number.toString().padStart(3, '0');
        const audioSrc = `/VoyagerGoldenRecords/${paddedTrackNumber}.mp3`;

        if (audioRef.current.src !== audioSrc) {
             console.log(`playTrack: Setting src to ${audioSrc}`);
             audioRef.current.src = audioSrc;
             audioRef.current.load();
        }

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                 console.log(`playTrack: Play command succeeded for ${audioSrc}`);
            }).catch(error => {
                 console.error(`playTrack: Error playing ${audioSrc}:`, error);
                 setIsPlaying(false);
            });
        } else {
             console.log(`playTrack: play() did not return a promise.`);
        }
    }, [tracks]);

    const { availableImages } = useMemo(() => {
        const available = images.filter(img => img.low_copyright_risk);
        const remaining = images.filter(img => !img.low_copyright_risk);
        const imagesWithCopyright = remaining.length > 0
            ? [...available, { name: '', low_copyright_risk: true } as Image]
            : available;
        return { availableImages: imagesWithCopyright };
    }, [images]);

    const currentTrack = useMemo(() => {
        if (currentTrackIndex === null || !tracks[currentTrackIndex]) {
            return null;
        }
        return tracks[currentTrackIndex];
    }, [currentTrackIndex, tracks]);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.volume = volume;
            console.log("Audio element created");
        }
        const firstPlayableIndex = tracks.findIndex(t => t?.low_copyright_risk);
        if (firstPlayableIndex !== -1 && currentTrackIndex === null) {
             console.log("Autoplaying initial track:", firstPlayableIndex);
             setTimeout(() => {
                playTrack(firstPlayableIndex);
             }, 1200);
        }

        // Return a cleanup function
        return () => {
            console.log("PeaceMusicPlayer unmounting: Pausing audio.");
            audioRef.current?.pause();
            if (audioRef.current) {
                audioRef.current.src = '';
            }
        };

    }, []); // Keep empty dependency array for mount/unmount effect

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleTimeUpdate = () => {
             if (!isSeeking) {
                 setCurrentTime(audio.currentTime);
             }
        };
        const handleDurationChange = () => setDuration(audio.duration || 0);
        const handleVolumeChange = () => {
             setVolume(audio.volume);
             setIsMuted(audio.muted);
        };
        const handleEnded = () => {
             console.log("Audio ended, calling playNextTrack");
             playNextTrack();
        };
        const handleLoadedMetadata = () => {
            console.log("Metadata loaded, duration:", audio.duration);
            setDuration(audio.duration || 0);
        };
        const handleCanPlay = () => {
             console.log("Audio can play");
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('volumechange', handleVolumeChange);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('canplay', handleCanPlay);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
             audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('volumechange', handleVolumeChange);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('canplay', handleCanPlay);
        };
    }, [isSeeking]);

    const playNextTrack = useCallback(() => {
        console.log("playNextTrack called");
        const playableTracks = tracks
            .map((track, index) => ({ track, index }))
            .filter(item => item.track?.low_copyright_risk);

        if (playableTracks.length === 0) {
            console.log("playNextTrack: No playable tracks found.");
            setIsPlaying(false);
            setCurrentTrackIndex(null);
            if (audioRef.current) audioRef.current.src = '';
            return;
        }

        let currentPlayableIndex = -1;
        if (currentTrackIndex !== null) {
            currentPlayableIndex = playableTracks.findIndex(item => item.index === currentTrackIndex);
        }

        let nextPlayableIndex = (currentPlayableIndex + 1) % playableTracks.length;

        const nextTrackItem = playableTracks[nextPlayableIndex];
        console.log(`playNextTrack: Next playable track item index: ${nextPlayableIndex}, Original index: ${nextTrackItem.index}`);
        playTrack(nextTrackItem.index);

    }, [currentTrackIndex, tracks, playTrack]);

    const pauseAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
             console.log("pauseAudio called");
        }
    }, []);

    const togglePlay = useCallback(() => {
        if (isPlaying) {
            pauseAudio();
        } else {
            if (currentTrackIndex === null) {
                 const firstPlayableIndex = tracks.findIndex(t => t?.low_copyright_risk);
                 if (firstPlayableIndex !== -1) {
                     playTrack(firstPlayableIndex);
                 } else {
                     console.log("togglePlay: No playable track to start.");
                 }
            } else {
                 if (audioRef.current) {
                     const playPromise = audioRef.current.play();
                     if (playPromise !== undefined) {
                         playPromise.catch(error => {
                             console.error(`togglePlay: Error resuming play:`, error);
                             setIsPlaying(false);
                         });
                     }
                 }
            }
        }
    }, [isPlaying, currentTrackIndex, tracks, playTrack, pauseAudio]);

    const handleTimeChange = useCallback((time: number) => {
        if (audioRef.current) {
             console.log(`handleTimeChange: Setting time to ${time}`);
            setIsSeeking(true);
            audioRef.current.currentTime = time;
            setCurrentTime(time);
            setTimeout(() => setIsSeeking(false), 100);
        }
    }, []);

    const handleVolumeChange = (newVolume: number) => {
        if (audioRef.current) {
            // Always set the volume property to the desired level
            audioRef.current.volume = newVolume;
            // The muted state is handled separately by onToggleMute
            setVolume(newVolume); 
        }
    };

    const handleToggleMute = useCallback(() => {
        if (audioRef.current) {
            const newMuteState = !audioRef.current.muted;
            audioRef.current.muted = newMuteState;
            setIsMuted(newMuteState);
        }
    }, []);

    const trackList = useMemo(() => (
        <div className="overflow-y-auto scrollbar-none no-scrollbar" style={{ maxHeight: '180px' }}>
            {tracks.map((track, index) => {
                const isDisabled = !track.low_copyright_risk;
                const buttonContent = (
                    <div className="w-full flex justify-between items-center gap-3">
                        <div className={cn(
                            "text-xs font-mono shrink-0",
                            currentTrackIndex === index ? "text-yellow-500/70" : "text-white/70",
                            isDisabled && "text-gray-400/70"
                        )}>{track.track_number.toString().padStart(2, '0')}</div>
                        <div className="flex-1 min-w-0"> 
                            <div className={cn(
                                "text-sm truncate",
                                currentTrackIndex === index ? "text-yellow-500" : "text-white",
                                isDisabled && "text-gray-400"
                            )}>{track.title}</div>
                            {track.artist && (
                                <div className={cn(
                                    "text-xs truncate",
                                    currentTrackIndex === index ? "text-yellow-500/60" : "text-white/60",
                                    isDisabled && "text-gray-400/60"
                                )}>{track.artist}</div>
                            )}
                        </div>
                        <div className={cn(
                            "text-xs ml-2 shrink-0",
                            currentTrackIndex === index ? "text-yellow-500/50" : "text-white/50",
                            isDisabled && "text-gray-400/50"
                        )}>{track.country_code}</div>
                    </div>
                );

                return (
                    <div key={track.track_number} className="relative group">
                        <button
                            onClick={() => playTrack(index)}
                            disabled={isDisabled}
                            className={cn(
                                "w-full px-3 py-2 text-left hover:bg-yellow-500/5 transition-colors min-h-[3.5rem] flex flex-col justify-center relative",
                                currentTrackIndex === index && "bg-yellow-500/10",
                                isDisabled && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {buttonContent}
                        </button>
                        {isDisabled && (
                            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-2 w-max hidden group-hover:block bg-black border border-gray-700 rounded-md p-2 shadow-lg z-10 pointer-events-none">
                                <div className="text-xs text-gray-300 mb-1 flex items-center gap-1">
                                    <Info size={14} /> Protected by copyright
                                </div>
                                <a href="https://goldenrecord.org/#discus-aureus" target="_blank" rel="noopener noreferrer" 
                                   className="text-xs text-yellow-500 flex items-center gap-1 hover:underline pointer-events-auto">
                                    View on goldenrecord.org
                                    <ExternalLink size={12} />
                                </a>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    ), [tracks, currentTrackIndex, playTrack]);

    const customAudioPlayer = currentTrack && (
        <div className="audio-player-container">
            <CustomPlayerUI
                ref={audioPlayerUIRef}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                volume={volume}
                isMuted={isMuted}
                onPlayPause={togglePlay}
                onTimeChange={handleTimeChange}
                onVolumeChange={handleVolumeChange}
                onToggleMute={handleToggleMute}
                className="voyager-audio-player"
            />
        </div>
    );

    if (playerState === 'collapsed') {
        return (
            <>
                <div
                    className="fixed bottom-14 right-8 z-50 w-16 h-16 rounded-full bg-[#d20033] text-white 
                            flex items-center justify-center shadow-lg cursor-pointer overflow-hidden
                            transition-all duration-300 ease-in-out transform scale-100 hover:scale-110"
                    onClick={() => setPlayerState('expanded')}
                >
                    <div
                        className={cn(
                            "w-full h-full bg-cover bg-center",
                            isPlaying ? "animate-[spin_8s_linear_infinite]" : ""
                        )}
                        style={{
                            backgroundImage: "url('/The_Sounds_of_Earth.jpg')"
                        }}
                    />
                </div>
            </>
        );
    }

    return (
        <div className="fixed bottom-14 right-8 z-50">
            <div className="flex items-start transition-all duration-300 ease-in-out transform origin-bottom-right scale-100">
                <div className="absolute top-0 left-0 transform -translate-x-full">
                    <div className="flex flex-col text-yellow-500 p-1 rounded-lg handle cursor-move">
                        <button
                            onClick={() => setPlayerState('collapsed')}
                            className="hover:bg-yellow-500/20 bg-black border border-yellow-500/30 p-1 rounded transition-colors mb-1"
                            title="Minimize player"
                        >
                            <PictureInPicture size={16} />
                        </button>
                        <button
                            onClick={() => {
                                pauseAudio();
                                setPlayerState('collapsed');
                            }}
                            className="hover:bg-yellow-500/20 bg-black border border-yellow-500/30 p-1 rounded transition-colors"
                            title="Close player"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <div className="w-[360px] bg-black rounded-sm overflow-hidden border border-yellow-500/30 shadow-2xl">
                    <div className="flex justify-between items-center p-3 border-b border-yellow-500/30">
                        <h2 className="text-yellow-500 text-base font-semibold w-full text-center">{pageCommonData.voyager.title}</h2>
                    </div>

                    <div className="flex flex-col p-1">
                        <div className="relative bg-black" style={{ height: '200px' }}>
                            {availableImages.length > 0 && (
                                <Carousel
                                    opts={{ loop: true }}
                                    plugins={[]}
                                    className="w-full h-full"
                                >
                                    <CarouselContent className="h-full">
                                        {availableImages.map((image, index) => (
                                            <CarouselItem key={index} className="h-full">
                                                {image.name === '' ? (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-black/60">
                                                        <div className="flex flex-col items-center gap-2 max-h-[200px] overflow-y-auto">
                                                            <div className="text-yellow-500/80 text-base font-medium flex items-center gap-2">
                                                                <AlertCircle size={16} className="text-yellow-500/80" />
                                                                <span>{pageCommonData.voyager.copyright_notice_title}</span>
                                                            </div>

                                                            <div className="text-white/70 text-[8px] max-w-[260px] space-y-2">
                                                                <p>
                                                                    {pageCommonData.voyager.copyright_notice}
                                                                </p>
                                                            </div>
                                                            <a
                                                                href="https://goldenrecord.org/#discus-aureus"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-yellow-500 hover:text-yellow-400 text-xs flex items-center gap-1 underline"
                                                            >
                                                                View all on goldenrecord.org
                                                                <ExternalLink size={12} />
                                                            </a>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="relative h-full flex items-center justify-center">
                                                        <img
                                                            src={`/VoyagerGoldenRecords/${(images.findIndex(img => img === image) + 1).toString().padStart(3, '0')}.png`}
                                                            alt={image.name || 'Voyager Image'}
                                                            className="max-h-[200px] w-auto object-contain bg-black rounded-sm opacity-70"
                                                            onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }}
                                                        />
                                                        <div className="absolute bottom-0 left-0 right-0 text-center">
                                                            <div className="text-white/90 bg-black/50 py-1 px-4 mb-2">
                                                                <div className="text-sm truncate">{image.name || 'Loading...'}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white bg-black/30 rounded-full p-1 transition-colors" />
                                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white bg-black/30 rounded-full p-1 transition-colors" />
                                </Carousel>
                            )}
                        </div>

                        <div className="border-t border-b border-yellow-500/30 bg-yellow-500/10">
                            <div className="flex flex-col px-2 py-2">
                                {customAudioPlayer}
                            </div>
                        </div>

                        {trackList}
                    </div>
                </div>
            </div>

            <style>{`
                .voyager-audio-player button:hover {
                    color: #f59e0b !important;
                }
            `}</style>
        </div>
    );
};

export default VoyagerGoldenRecordsPlayer;