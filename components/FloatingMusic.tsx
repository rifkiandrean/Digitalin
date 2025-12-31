
import React, { useState, useEffect, useRef } from 'react';
import { Music, Music2 } from 'lucide-react';
import { getDriveMediaUrl } from '../constants';

interface FloatingMusicProps {
  audioUrl: string;
}

const FloatingMusic: React.FC<FloatingMusicProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Convert to direct URL if it's a Google Drive link
    const processedUrl = getDriveMediaUrl(audioUrl, 'audio');

    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(processedUrl);
    audioRef.current.loop = true;
    
    const playAttempt = () => {
        if (audioRef.current) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => console.log('Autoplay blocked'));
        }
    };
    
    window.addEventListener('click', playAttempt, { once: true });
    
    return () => {
      audioRef.current?.pause();
      window.removeEventListener('click', playAttempt);
    };
  }, [audioUrl]);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggleMusic}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
        isPlaying ? 'bg-blue-900 text-white animate-spin-slow' : 'bg-white text-blue-900'
      }`}
      style={{ animationDuration: '8s' }}
    >
      {isPlaying ? <Music className="w-6 h-6" /> : <Music2 className="w-6 h-6" />}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </button>
  );
};

export default FloatingMusic;
