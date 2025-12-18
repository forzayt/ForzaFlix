import { useQuery } from '@tanstack/react-query';
import { getTrending, getPopularMovies, getTopRatedMovies, getPopularTVShows, getIndianMovies, getImageUrl, Movie, TVShow } from '@/services/tmdb';
import { useState, useEffect } from 'react';
import { Play, X, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MovieRow from '@/components/MovieRow';
import { Skeleton } from '@/components/ui/skeleton';
import { getContinueWatching, removeFromContinueWatching, ContinueWatchingItem } from '@/lib/continueWatching';

const Index = () => {
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);

  useEffect(() => {
    setContinueWatching(getContinueWatching());
  }, []);

  const handleRemove = (e: React.MouseEvent, id: number, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromContinueWatching(id, type);
    setContinueWatching(getContinueWatching());
  };
  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: () => getTrending('all', 'week'),
  });

  const { data: popularMovies } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: () => getPopularMovies(),
  });

  const { data: topRatedMovies } = useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: () => getTopRatedMovies(),
  });

  const { data: popularTVShows } = useQuery({
    queryKey: ['popularTVShows'],
    queryFn: () => getPopularTVShows(),
  });

  const { data: indianMovies } = useQuery({
    queryKey: ['indianMovies'],
    queryFn: () => getIndianMovies(),
  });

  const heroItems = trending?.results?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      {trendingLoading ? (
        <div className="h-[85vh] bg-secondary animate-pulse" />
      ) : heroItems.length > 0 ? (
        <HeroSection items={heroItems} />
      ) : null}

      {/* Content Rows */}
      <div className="relative z-10 -mt-32 pb-20">
        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <div className="px-4 md:px-12 mb-12 pt-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
              <Clock size={24} className="text-primary" />
              Continue Watching
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
              {continueWatching.map((item) => (
                <div key={`${item.type}-${item.id}`} className="group relative flex-shrink-0">
                  <Link
                    to={`/watch/${item.type}/${item.id}${item.type !== 'movie' ? `?s=${item.season}&e=${item.episode}` : ''}`}
                    className="block w-[280px] md:w-[350px] aspect-video rounded-xl overflow-hidden bg-secondary transition-all hover:scale-105 hover:z-10 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <img
                      src={getImageUrl(item.backdrop_path || item.poster_path, 'w500')}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-sm md:text-base font-bold line-clamp-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      {item.type !== 'movie' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Season {item.season} • Episode {item.episode}
                        </p>
                      )}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-primary/90 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform">
                        <Play size={24} fill="currentColor" className="ml-1 text-primary-foreground" />
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={(e) => handleRemove(e, item.id, item.type)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-destructive backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 focus:bg-destructive focus:outline-none focus:ring-2 focus:ring-white transition-all z-20"
                    title="Remove from history"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Movies */}
        {popularMovies?.results && (
          <MovieRow
            title="🎬 Popular Movies"
            items={popularMovies.results}
            type="movie"
          />
        )}

        {/* Top Rated Movies */}
        {topRatedMovies?.results && (
          <MovieRow
            title="⭐ Top Rated Movies"
            items={topRatedMovies.results}
            type="movie"
          />
        )}

        {/* Popular TV Shows */}
        {popularTVShows?.results && (
          <MovieRow
            title="📺 Popular TV Shows"
            items={popularTVShows.results}
            type="tv"
          />
        )}

        {/* Indian Popular */}
        {indianMovies?.results && (
          <MovieRow
            title="Popular on India"
            items={indianMovies.results}
            type="movie"
          />
        )}
      </div>
    </div>
  );
};

export default Index;