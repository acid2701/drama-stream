import { Play } from 'lucide-react';
import type { BaseMediaItem } from '../../api/types';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface MediaCardProps {
  item: BaseMediaItem;
  className?: string;
  featured?: boolean;
}

export function MediaCard({ item, className, featured = false }: MediaCardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/detail/${item.provider}/${item.id}`);
    };

  return (
    <div 
        className={cn(
            "group relative overflow-hidden rounded-lg bg-surface transition-all hover:scale-105 cursor-pointer",
            featured ? "aspect-[16/9]" : "aspect-[2/3]",
            className
        )}
        onClick={handleClick}
    >
      <img
        src={`https://images.weserv.nl/?url=${encodeURIComponent(item.cover)}&w=400&h=600&fit=cover&output=webp`}
        alt={item.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:opacity-80"
        onError={(e) => {
            // Fallback to placeholder if proxy also fails
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('placehold.co')) {
                target.src = 'https://placehold.co/400x600?text=No+Image';
            }
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 transition-opacity" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-4">
        {item.score && (
            <div className="mb-2 inline-block rounded bg-primary/90 px-2 py-0.5 text-xs font-bold text-white">
                {item.score}
            </div>
        )}
        <h3 className={cn("font-bold text-white leading-tight line-clamp-2", featured ? "text-2xl" : "text-sm")}>
          {item.title}
        </h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
            <span className="capitalize text-primary font-medium">{item.provider}</span>
            {item.episodeCount && <span>• {item.episodeCount} Eps</span>}
        </div>
      </div>

      {/* Hover Play Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
        <div className="rounded-full bg-primary/90 p-3 text-white shadow-lg backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
          <Play className="fill-white h-6 w-6 pl-1" />
        </div>
      </div>
    </div>
  );
}
