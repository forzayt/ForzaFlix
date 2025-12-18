import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, TVShow } from '@/services/tmdb';
import MovieCard from './MovieCard';
import { cn } from '@/lib/utils';

interface MovieRowProps {
  title: string;
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
  className?: string;
}

const MovieRow = ({ title, items, type, className }: MovieRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!items.length) return null;

  return (
    <section className={cn('relative py-6', className)}>
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-8">{title}</h2>

      <div className="group/row relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-background ml-2"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 py-4 -my-4"
        >
          {items.map((item) => (
            <MovieCard 
              key={item.id} 
              item={item} 
              type={type} 
              className="group-hover/row:opacity-50 hover:!opacity-100 transition-opacity duration-300"
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-background mr-2"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default MovieRow;