import { useQuery } from '@tanstack/react-query';
import { getTrending, getPopularMovies, getTopRatedMovies, getPopularTVShows, Movie, TVShow } from '@/services/tmdb';
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

  const heroItem = trending?.results[0];
  const heroType = heroItem?.media_type === 'tv' ? 'tv' : 'movie';

  const getMediaType = (item: Movie | TVShow) => {
    if ('title' in item) return 'movie';
    return 'tv';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      {trendingLoading ? (
        <div className="h-[85vh] bg-secondary animate-pulse" />
      ) : heroItem ? (
        <HeroSection item={heroItem} type={heroType} />
      ) : null}

      {/* Content Rows */}
      <div className="relative z-10 -mt-32 pb-20">
        {/* Trending Now */}
        {trending?.results && (
          <MovieRow
            title="🔥 Trending Now"
            items={trending.results.slice(1, 20)}
            type="movie"
          />
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
      </div>
    </div>
  );
};

export default Index;