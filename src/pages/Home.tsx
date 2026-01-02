import { useQueries } from '@tanstack/react-query';
import { dramaboxService } from '../api/services/dramabox';
import { netshortService } from '../api/services/netshort';
import { meloloService } from '../api/services/melolo';
import { animeService } from '../api/services/anime';
import { HeroCarousel } from '../components/media/HeroCarousel';
import { MediaGrid } from '../components/media/MediaGrid';
import { ErrorView } from '../components/ui/ErrorView';
import { Loader2 } from 'lucide-react';
import { useContinueWatching } from '../hooks/useContinueWatching';

export default function Home() {
  const [
    dramaboxQuery,
    netshortQuery,
    meloloQuery,
    animeQuery
  ] = useQueries({
    queries: [
      { 
        queryKey: ['dramabox', 'latest'], 
        queryFn: dramaboxService.getLatest,
        staleTime: 1000 * 60 * 5 // 5 minutes
      },
      { 
        queryKey: ['netshort', 'foryou'], 
        queryFn: netshortService.getForYou,
         staleTime: 1000 * 60 * 5 
      },
      { 
        queryKey: ['melolo', 'trending'], 
        queryFn: meloloService.getTrending,
         staleTime: 1000 * 60 * 5 
      },
      { 
        queryKey: ['anime', 'latest'], 
        queryFn: animeService.getLatest,
         staleTime: 1000 * 60 * 5 
      }
    ]
  });

  const isLoading = dramaboxQuery.isLoading || netshortQuery.isLoading || meloloQuery.isLoading || animeQuery.isLoading;
  const isError = dramaboxQuery.isError && netshortQuery.isError && meloloQuery.isError && animeQuery.isError; // Only strict error if ALL fail, otherwise show partial

  // Initial loading state only if no data at all
  if (isLoading && !dramaboxQuery.data && !netshortQuery.data) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
      return <ErrorView message="Failed to load content. Please check your connection." onRetry={() => window.location.reload()} />;
  }

  // Combine items for Hero Carousel
  const heroItems = [
      ...(dramaboxQuery.data?.slice(0, 2) || []),
      ...(netshortQuery.data?.slice(0, 1) || []),
      ...(meloloQuery.data?.slice(0, 1) || []),
      ...(animeQuery.data?.slice(0, 1) || []),
  ].slice(0, 5);

  const { history } = useContinueWatching();

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Hero Section */}
      <HeroCarousel items={heroItems} />

      {/* Continue Watching */}
      {history.length > 0 && (
          <section>
              <MediaGrid
                  title="Continue Watching"
                  items={history}
                  isLoading={false}
              />
          </section>
      )}

      {/* Sections */}
      <div className="space-y-12">
        <section>
             <MediaGrid 
                title="DramaBox Latest" 
                items={dramaboxQuery.data || []} 
                isLoading={dramaboxQuery.isLoading} 
             />
        </section>

        <section>
             <MediaGrid 
                title="NetShort For You" 
                items={netshortQuery.data || []} 
                isLoading={netshortQuery.isLoading} 
             />
        </section>

        <section>
             <MediaGrid 
                title="Populer di Melolo" 
                items={meloloQuery.data || []} 
                isLoading={meloloQuery.isLoading} 
             />
        </section>

        <section>
             <MediaGrid 
                title="Anime Updates" 
                items={animeQuery.data || []} 
                isLoading={animeQuery.isLoading} 
             />
        </section>
      </div>
    </div>
  );
}
