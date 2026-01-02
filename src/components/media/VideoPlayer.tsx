import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

export function VideoPlayer({ src, poster, autoPlay = false, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset states when src changes
    setLoading(true);
    setError(null);

    let hls: Hls | null = null;

    const handleCanPlay = () => setLoading(false);
    const handleError = (_: Event) => {
        setLoading(false);
        setError("Error loading video");
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    if (Hls.isSupported() && src.endsWith('.m3u8')) {
      hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
            video.play().catch(() => {
                // Autoplay failed, usually due to browser policy
            });
        }
        setLoading(false);
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
              setLoading(false);
              setError("Stream error");
          }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        if (autoPlay) video.play().catch(() => {});
        setLoading(false);
      });
    } else {
      // Direct file (mp4) or not supported HLS
      video.src = src;
      video.load();
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, autoPlay]);

  return (
    <div className={cn("relative w-full aspect-video bg-black rounded-lg overflow-hidden group", className)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}
      
      {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/80 text-white">
              <p>{error}</p>
          </div>
      )}

      <video
        ref={videoRef}
        controls
        poster={poster}
        className="w-full h-full"
        playsInline
      />
    </div>
  );
}
