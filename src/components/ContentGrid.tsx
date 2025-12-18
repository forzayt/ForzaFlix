import { Movie, TVShow } from '@/services/tmdb';
import MovieCard from './MovieCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ContentGridProps {
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
  isLoading?: boolean;
}

const ContentGrid = ({ items, type, isLoading }: ContentGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[2/3] rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground text-lg">No content found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {items.map((item) => (
        <MovieCard key={item.id} item={item} type={type} className="w-full" />
      ))}
    </div>
  );
};

export default ContentGrid;