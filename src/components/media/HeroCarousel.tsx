import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import type { BaseMediaItem } from '../../api/types';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils'; // Assuming utils exists

interface HeroCarouselProps {
  items: BaseMediaItem[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-rotate
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!items.length) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden rounded-xl group">
      {/* Background Image */}
      <div 
        key={currentItem.id} // Key to trigger animation
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out transform scale-105"
        style={{ backgroundImage: `url(${currentItem.cover})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col justify-end items-start gap-4 z-10">
        <div className="animate-fade-in space-y-2 max-w-2xl">
            <span className="inline-block px-2 py-1 bg-primary text-white text-xs font-bold rounded uppercase tracking-wider">
                {currentItem.provider}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
            {currentItem.title}
            </h1>
            {currentItem.score && (
                <div className="flex items-center gap-2 text-yellow-400 font-bold">
                    <span>⭐ {currentItem.score}</span>
                </div>
            )}
        </div>
        
        <div className="flex items-center gap-3 mt-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => navigate(`/watch/${currentItem.provider}/${currentItem.id}`)}
            className="gap-2"
          >
            <Play className="fill-current h-5 w-5" />
            Watch Now
          </Button>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-20">
        {items.map((_, idx) => (
          <button
            key={idx}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              idx === currentIndex ? "w-6 bg-primary" : "w-2 bg-white/50 hover:bg-white"
            )}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}
