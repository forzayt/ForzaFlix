import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { getImageUrl, Movie, TVShow } from '@/services/tmdb';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
  className?: string;
}

const MovieCard = ({ item, type, className }: MovieCardProps) => {
  const title = 'title' in item ? item.title : item.name;
  const date = 'release_date' in item ? item.release_date : item.first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';

  return (
    <Link
      to={`/${type}/${item.id}`}
      className={cn(
        'group relative flex-shrink-0 w-[160px] md:w-[200px] transition-transform duration-300 hover:scale-105 hover:z-10',
        className
      )}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
        <img
          src={getImageUrl(item.poster_path, 'w500')}
          alt={title}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-primary rounded-full p-3 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play size={24} fill="currentColor" className="text-primary-foreground ml-1" />
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-semibold">{item.vote_average.toFixed(1)}</span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">{year}</p>
      </div>
    </Link>
  );
};

export default MovieCard;