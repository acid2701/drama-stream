import type { BaseMediaItem } from '../../api/types';
import { MediaCard } from './MediaCard';
import { Skeleton } from '../ui/skeleton';

interface MediaGridProps {
  title?: string;
  items: BaseMediaItem[];
  isLoading?: boolean;
}

export function MediaGrid({ title, items, isLoading }: MediaGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
           {[...Array(10)].map((_, i) => (
             <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
           ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="space-y-4 my-8">
      {title && (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white border-l-4 border-primary pl-3">{title}</h2>
          </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <MediaCard key={`${item.provider}-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  );
}
