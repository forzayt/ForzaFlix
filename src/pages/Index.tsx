import { useQuery } from '@tanstack/react-query';
import { getTrending, getPopularMovies, getTopRatedMovies, getPopularTVShows, getIndianMovies, Movie, TVShow } from '@/services/tmdb';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MovieRow from '@/components/MovieRow';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
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