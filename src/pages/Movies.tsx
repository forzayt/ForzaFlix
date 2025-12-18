import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { discoverMovies, getMovieGenres } from '@/services/tmdb';
import Navbar from '@/components/Navbar';
import ContentGrid from '@/components/ContentGrid';
import GenreFilter from '@/components/GenreFilter';
import { Button } from '@/components/ui/button';

const Movies = () => {
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const { data: genres } = useQuery({
    queryKey: ['movieGenres'],
    queryFn: getMovieGenres,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['discoverMovies', page, selectedGenre],
    queryFn: () => discoverMovies({ page, with_genres: selectedGenre || undefined }),
  });

  const handleGenreChange = (genreId: string | null) => {
    setSelectedGenre(genreId);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Movies</h1>
            <p className="text-muted-foreground">Discover the latest and greatest films</p>
          </div>

          {/* Genre Filter */}
          {genres?.genres && (
            <div className="mb-8">
              <GenreFilter
                genres={genres.genres}
                selectedGenre={selectedGenre}
                onSelectGenre={handleGenreChange}
              />
            </div>
          )}

          {/* Content Grid */}
          <ContentGrid
            items={data?.results || []}
            type="movie"
            isLoading={isLoading}
          />

          {/* Pagination */}
          {data && (
            <div className="flex justify-center gap-4 mt-12">
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-muted-foreground">
                Page {page} of {Math.min(data.total_pages, 500)}
              </span>
              <Button
                variant="secondary"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.min(data.total_pages, 500)}
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

export default Movies;