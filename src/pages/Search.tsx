import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { Search as SearchIcon } from 'lucide-react';
import { dramaboxService } from '../api/services/dramabox';
import { netshortService } from '../api/services/netshort';
import { meloloService } from '../api/services/melolo';
import { animeService } from '../api/services/anime';
import { MediaGrid } from '../components/media/MediaGrid';
import { Button } from '../components/ui/button';
import type { BaseMediaItem } from '../api/types';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);

  const [
    dramaboxQuery,
    netshortQuery,
    meloloQuery,
    animeQuery
  ] = useQueries({
    queries: [
      { queryKey: ['dramabox', 'search', query], queryFn: () => dramaboxService.search(query), enabled: !!query },
      { queryKey: ['netshort', 'search', query], queryFn: () => netshortService.search(query), enabled: !!query },
      { queryKey: ['melolo', 'search', query], queryFn: () => meloloService.search(query), enabled: !!query },
      { queryKey: ['anime', 'search', query], queryFn: () => animeService.search(query), enabled: !!query },
    ]
  });

  const isLoading = dramaboxQuery.isLoading || netshortQuery.isLoading || meloloQuery.isLoading || animeQuery.isLoading;
  
  // Aggregate results
  const allResults: BaseMediaItem[] = [
      ...(dramaboxQuery.data || []),
      ...(netshortQuery.data || []),
      ...(meloloQuery.data || []),
      ...(animeQuery.data || []),
  ];

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchInput.trim()) {
          setSearchParams({ q: searchInput });
      }
  };

  return (
    <div className="container mx-auto max-w-7xl animate-fade-in pb-20">
       {/* Search Input Area */}
       <div className="my-8 flex justify-center sticky top-20 z-30 px-4">
           <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-lg shadow-lg">
               <input 
                  type="text" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search drama, anime, movie..." 
                  className="flex-1 bg-surfaceHighlight/90 backdrop-blur text-white px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary border border-white/5"
               />
               <Button type="submit" className="rounded-l-none h-auto px-6">
                   <SearchIcon className="h-5 w-5" />
               </Button>
           </form>
       </div>

       {/* Results */}
       {query && (
           <div className="space-y-8">
               <div className="flex items-center justify-between">
                   <h2 className="text-xl font-bold text-white">Results for "{query}"</h2>
                   <span className="text-sm text-gray-400">{allResults.length} items found</span>
               </div>
               
               {isLoading && <div className="text-center text-gray-400 py-10">Searching across all providers...</div>}
               
               {!isLoading && allResults.length === 0 && (
                   <div className="text-center text-gray-500 py-20 bg-surfaceHighlight/20 rounded-lg">
                       No results found. Try a different keyword.
                   </div>
               )}

               <MediaGrid items={allResults} />
           </div>
       )}

       {!query && (
           <div className="text-center text-gray-500 py-20 mt-10">
               <SearchIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
               <p className="text-xl">Search for your favorite movies and shows</p>
           </div>
       )}
    </div>
  );
}
