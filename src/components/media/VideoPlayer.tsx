import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { cn } from '../../lib/utils';
import { Loader2, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
  onError?: (error: string) => void;
}

export function VideoPlayer({ src, poster, autoPlay = false, className, onError: propOnError }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('[VideoPlayer] Initializing with src:', src);

    // Reset states when src changes
    setLoading(true);
    setError(null);

    // Safety timeout: If video doesn't load within 10s, trigger error/fallback
    const timeoutId = setTimeout(() => {
        if (videoRef.current && videoRef.current.paused && videoRef.current.readyState < 3) {
            console.warn('[VideoPlayer] Loading timed out, triggering fallback');
            setLoading(false);
            if (propOnError) propOnError("Loading timed out");
        }
    }, 10000); // 10 seconds

    let hls: Hls | null = null;

    const handleCanPlay = () => setLoading(false);
    const handleError = (e: Event | string) => {
        console.error('[VideoPlayer] Native Error:', e);
        setLoading(false);
        setError("Error loading video");
        if (propOnError) propOnError("Error loading video");
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Check for HLS support
    // Improvement: Check if it LOOKS like HLS (contains .m3u8) or if explicitly supported Native HLS
    const isHlsSource = src.includes('.m3u8') || src.includes('m3u8'); // More lenient check 

    if (Hls.isSupported() && isHlsSource) {
      console.log('[VideoPlayer] using Hls.js');
      hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('[VideoPlayer] Manifest Parsed');
        if (autoPlay) {
            video.play().catch((err) => {
                console.warn('[VideoPlayer] Autoplay blocked:', err);
            });
        }
        setLoading(false);
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
              console.error('[VideoPlayer] HLS Fatal Error:', data);
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls?.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls?.recoverMediaError();
                  break;
                default:
                  setLoading(false);
                  const msg = `Stream error: ${data.details}`;
                  setError(msg);
                  hls?.destroy();
                  if (propOnError) propOnError(msg);
                  break;
              }
          } else {
             console.warn('[VideoPlayer] HLS Non-fatal Error:', data);
          }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      console.log('[VideoPlayer] using Native HLS');
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        if (autoPlay) video.play().catch(() => {});
        setLoading(false);
      });
    } else {
      // Direct file (mp4) or fallback
      console.log('[VideoPlayer] using Standard Video Load (MP4/Direct)');
      video.src = src;
      video.load();
    }

    return () => {
      clearTimeout(timeoutId);
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
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/80 text-white p-4 text-center">
              <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
              <p className="text-red-400 font-medium">{error}</p>
              <p className="text-xs text-gray-500 mt-2 break-all">{src}</p>
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
