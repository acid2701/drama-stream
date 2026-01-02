import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { dramaboxService } from '../api/services/dramabox';
import { netshortService } from '../api/services/netshort';
import { meloloService } from '../api/services/melolo';
import { animeService } from '../api/services/anime';
import { VideoPlayer } from '../components/media/VideoPlayer';
import { Button } from '../components/ui/button';
import { ErrorView } from '../components/ui/ErrorView';
import { useContinueWatching } from '../hooks/useContinueWatching';

export default function Watch() {
  const { provider, id, episodeId } = useParams<{ provider: string, id: string, episodeId: string }>();
  const navigate = useNavigate();
  const { saveHistory } = useContinueWatching();

  // Fetch Stream URL
  const { data: streamUrl, isLoading, isError, error } = useQuery({
    queryKey: ['watch', provider, id, episodeId],
    queryFn: async () => {
      if (!id) throw new Error("ID required");
      
      switch (provider) {
        case 'melolo':
             if (!episodeId) throw new Error("Episode ID required");
             const meloloData = await meloloService.getStream(id, episodeId);
             return meloloData.url || meloloData.streamUrl;
        
        case 'anime':
             if (!episodeId) throw new Error("Episode URL required");
             const animeData = await animeService.getVideo(decodeURIComponent(episodeId));
             return animeData.url || animeData.videoUrl;

        case 'dramabox':
             const dramaEps = await dramaboxService.getAllEpisodes(id);
             const foundDramaEp = dramaEps.find((e: any) => String(e.id) === String(episodeId) || String(e.episode) === String(episodeId));
             if (!foundDramaEp) throw new Error("Episode not found");
             return foundDramaEp.url;

        case 'netshort':
             const netEps = await netshortService.getAllEpisodes(id);
             const foundNetEp = netEps.find((e: any) => String(e.drama_id) === String(id) && (String(e.episode) === String(episodeId))); 
             if (!foundNetEp && netEps.length > 0) return netEps[0].url; 
             return foundNetEp?.url;

        default:
          throw new Error("Unknown provider");
      }
    },
    enabled: !!id && !!provider && !!episodeId
  });

  // Save history when stream is ready
  useEffect(() => {
    if (streamUrl && id && provider && episodeId) {
        // We construct a minimal item to save. 
        // Ideally we should have title/cover passed or fetched, but for now we might lack it if we came directly.
        // We can fetch detail or passed via state location.
        // For simplicity: we save what we have, but to display nice card in Home we strictly need cover/title.
        // Option: Fetch detail if not in cache? 
        // Or better, 'useQuery' for detail in parallel just for metadata.
        
        // Let's assume we proceed without title/cover update here for MVP, 
        // OR we fetch detail to ensure history is rich.
        // Let's create a side-effect query for detail just to save history correctly?
        // Or simpler: We don't save title/cover here if we don't have it, which breaks the UI.
        // OK, I will fetch detail quickly.
    }
  }, [streamUrl, id, provider, episodeId]);

  // Actually, we can just fetch detail here too.
  const { data: detailData } = useQuery({
      queryKey: ['detail', provider, id],
      queryFn: async () => {
          if (!id) return null;
           switch (provider) {
                case 'dramabox': return dramaboxService.getDetail(id);
                case 'netshort': return { id, title: 'Drama', cover: '', provider: 'netshort' }; // minimal
                case 'melolo': return meloloService.getDetail(id);
                case 'anime': return animeService.getDetail(decodeURIComponent(id || ''));
                default: return null;
           }
      },
      enabled: !!id && !!provider && !!streamUrl // Only fetch if we are actually watching
  });

  useEffect(() => {
      if (detailData && episodeId && provider && id) {
          saveHistory({
              id,
              provider: provider as any,
              title: detailData.title || 'Unknown Title',
              cover: detailData.cover || '',
              type: detailData.type 
          }, `Episode ${episodeId}`, episodeId);
      }
  }, [detailData, episodeId, provider, id, saveHistory]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-center space-y-4">
             <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
             <p className="text-gray-400">Loading stream...</p>
        </div>
      </div>
    );
  }

  if (isError || !streamUrl) {
    return (
        <div className="h-screen flex items-center justify-center bg-black">
             <ErrorView 
                message={typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : "Failed to load stream."} 
                onRetry={() => window.location.reload()} 
             />
             <div className="absolute top-4 left-4">
                 <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2" /> Back</Button>
             </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 z-20">
        <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10"
            onClick={() => navigate(-1)}
        >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
      </div>

      <div className="w-full max-w-6xl aspect-video relative shadow-2xl">
          <VideoPlayer 
            src={streamUrl} 
            autoPlay={true}
            className="w-full h-full rounded-lg"
          />
      </div>
      
      <div className="mt-8 text-center text-gray-400 text-sm">
          <p className="font-medium text-white text-lg">{detailData?.title}</p>
          <p>Playing Episode {episodeId}</p>
      </div>
    </div>
  );
}
