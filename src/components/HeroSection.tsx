import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { getBackdropUrl, Movie, TVShow } from '@/services/tmdb';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
}

const HeroSection = ({ item, type }: HeroSectionProps) => {
  const title = 'title' in item ? item.title : item.name;
  const date = 'release_date' in item ? item.release_date : item.first_air_date;
  const year = date ? new Date(date).getFullYear() : '';
  const backdropUrl = getBackdropUrl(item.backdrop_path, 'original');

  return (
    <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      {backdropUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-24 md:pb-32">
        <div className="px-4 md:px-12 w-full">
          <div className="max-w-2xl space-y-4 animate-fade-in text-left">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-shadow">{title}</h1>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm md:text-base">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{item.vote_average.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">{year}</span>
              <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-semibold rounded">
                {type === 'movie' ? 'MOVIE' : 'TV SERIES'}
              </span>
            </div>

            {/* Overview */}
            <p className="text-foreground/80 text-sm md:text-base line-clamp-3 max-w-xl">
              {item.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <Button asChild size="lg" className="gap-2">
                <Link to={`/${type}/${item.id}#stream-player`}>
                  <Play size={20} fill="currentColor" />
                  Watch Now
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="gap-2">
                <Link to={`/${type}/${item.id}`}>
                  <Info size={20} />
                  More Info
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;