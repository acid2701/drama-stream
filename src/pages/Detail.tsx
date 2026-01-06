import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, PlayCircle } from 'lucide-react';
import { dramaboxService } from '../api/services/dramabox';
import { netshortService } from '../api/services/netshort';
import { meloloService } from '../api/services/melolo';
import { animeService } from '../api/services/anime';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';
import { ErrorView } from '../components/ui/ErrorView';

export default function Detail() {
  const { provider, id } = useParams<{ provider: string, id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['detail', provider, id],
    queryFn: async () => {
      if (!id) throw new Error("ID required");
      console.log('Fetching details for:', { provider, id });
      switch (provider) {
        case 'dramabox':
             // Need detailed info
             const detail = await dramaboxService.getDetail(id);
             // Ensure episodes are populated. If not, fetch random/latest/all? 
             // Actually dramaboxService.getDetail should handle it.
             // If episodes missing, fetch getAllEpisodes
             if (!detail.episodes || detail.episodes.length === 0) {
                 const eps = await dramaboxService.getAllEpisodes(id);
                 detail.episodes = eps;
             }
             return detail;
        case 'netshort':
            // Netshort detail logic might be simpler or need search fallback? 
            // Assuming we have a getDetail or just use getAllEpisodes
            const allEps = await netshortService.getAllEpisodes(id);
             return {
                 id,
                 title: `Drama ${id}`, // Fallback title if not available
                 cover: '', // Fallback
                 provider: 'netshort',
                 episodes: allEps
             };
        case 'melolo':
             return meloloService.getDetail(id);
        case 'anime':
             // ID might be URL for anime
             return animeService.getDetail(decodeURIComponent(id));
        default:
          throw new Error("Unknown provider");
      }
    },
    enabled: !!id && !!provider
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorView message="Failed to load details." onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="pb-20 animate-fade-in">
      {/* Banner / Header */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden rounded-xl mb-8">
          <div 
            className="absolute inset-0 bg-cover bg-center blur-sm scale-110 opacity-50"
            style={{ backgroundImage: `url(${data.cover})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col md:flex-row gap-8 items-end">
              <img 
                 src={data.cover} 
                 alt={data.title}
                 className="w-32 md:w-48 rounded-lg shadow-2xl border-2 border-white/10 z-10"
              />
              <div className="flex-1 z-10 space-y-4">
                  <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{data.title}</h1>
                  
                   <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                       <span className="bg-primary/20 text-primary px-3 py-1 rounded-full font-medium border border-primary/20 capitalize">
                           {provider}
                       </span>
                       {data.releaseDate && (
                           <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {data.releaseDate}</span>
                       )}
                       {data.episodes?.length > 0 && (
                            <span className="flex items-center gap-1"><PlayCircle className="h-4 w-4" /> {data.episodes.length} Episodes</span>
                       )}
                   </div>

                  <div className="pt-4">
                        <Button 
                            size="lg" 
                            className="gap-2" 
                            onClick={() => {
                                const firstEp = data.episodes?.[0];
                                if (firstEp) {
                                    // Navigate to watch
                                    const epId = firstEp.id || firstEp.episode || 1; // Fallback
                                    navigate(`/watch/${provider}/${encodeURIComponent(String(id))}/${encodeURIComponent(String(epId))}`);
                                }
                            }}
                        >
                            <PlayCircle className="h-5 w-5" /> Start Watching
                        </Button>
                  </div>
              </div>
          </div>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
              {data.synopsis && (
                  <div className="bg-surface p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-white mb-4">Synopsis</h3>
                      <p className="text-gray-300 leading-relaxed">{data.synopsis}</p>
                  </div>
              )}

              {/* Episode List */}
              <div className="bg-surface p-6 rounded-lg">
                   <h3 className="text-xl font-bold text-white mb-4">Episodes</h3>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                       {data.episodes?.map((ep: any, idx: number) => {
                            const epNum = idx + 1;
                            const epTitle = ep.title || `Episode ${epNum}`;
                            const epId = ep.id || ep.url || epNum; // Fallback
                            
                            return (
                                <button
                                    key={idx}
                                    onClick={() => navigate(`/watch/${provider}/${encodeURIComponent(String(id))}/${encodeURIComponent(String(epId))}`)}
                                    className="group flex flex-col items-center p-3 rounded bg-surfaceHighlight hover:bg-primary/20 border border-transparent hover:border-primary/50 transition-all text-center"
                                >
                                    <span className="text-lg font-bold text-white md:group-hover:text-primary mb-1">
                                        EP {epNum}
                                    </span>
                                    <span className="text-xs text-gray-500 line-clamp-1 group-hover:text-gray-300">
                                        {epTitle}
                                    </span>
                                </button>
                            );
                       })}
                   </div>
                   {(!data.episodes || data.episodes.length === 0) && (
                       <p className="text-gray-500 italic">No episodes available.</p>
                   )}
              </div>
          </div>

          {/* Sidebar / Related */}
          <div className="space-y-6">
               {data.genres && (
                   <div className="bg-surface p-6 rounded-lg">
                       <h3 className="text-md font-bold text-white mb-4">Genres</h3>
                       <div className="flex flex-wrap gap-2">
                           {data.genres.map(((g: string) => (
                               <span key={g} className="text-xs bg-surfaceHighlight px-3 py-1 rounded-full text-gray-300">
                                   {g}
                               </span>
                           )))}
                       </div>
                   </div>
               )}
          </div>
      </div>
    </div>
  );
}
