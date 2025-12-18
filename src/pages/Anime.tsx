import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnimeMovies, getAnimeTVShows, Movie, TVShow } from '@/services/tmdb';
import Navbar from '@/components/Navbar';
import ContentGrid from '@/components/ContentGrid';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AnimeTab = 'tv' | 'movies';

const Anime = () => {
  const [tab, setTab] = useState<AnimeTab>('tv');
  const [page, setPage] = useState(1);

  const { data: animeTVData, isLoading: tvLoading } = useQuery({
    queryKey: ['animeTV', page],
    queryFn: () => getAnimeTVShows(page),
    enabled: tab === 'tv',
  });

  const { data: animeMoviesData, isLoading: moviesLoading } = useQuery({
    queryKey: ['animeMovies', page],
    queryFn: () => getAnimeMovies(page),
    enabled: tab === 'movies',
  });

  const handleTabChange = (newTab: AnimeTab) => {
    setTab(newTab);
    setPage(1);
  };

  const currentData = tab === 'tv' ? animeTVData : animeMoviesData;
  const isLoading = tab === 'tv' ? tvLoading : moviesLoading;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20 px-4 md:px-12">
        <div>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Anime</h1>
            <p className="text-muted-foreground">Explore the best Japanese animation</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => handleTabChange('tv')}
              className={cn(
                'px-6 py-3 rounded-full text-sm font-semibold transition-colors',
                tab === 'tv'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              📺 Anime Series
            </button>
            <button
              onClick={() => handleTabChange('movies')}
              className={cn(
                'px-6 py-3 rounded-full text-sm font-semibold transition-colors',
                tab === 'movies'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              🎬 Anime Movies
            </button>
          </div>

          {/* Content Grid */}
          <ContentGrid
            items={currentData?.results || []}
            type={tab === 'tv' ? 'tv' : 'movie'}
            isLoading={isLoading}
          />

          {/* Pagination */}
          {currentData && (
            <div className="flex justify-center gap-4 mt-12">
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-muted-foreground">
                Page {page} of {Math.min(currentData.total_pages, 500)}
              </span>
              <Button
                variant="secondary"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.min(currentData.total_pages, 500)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Anime;