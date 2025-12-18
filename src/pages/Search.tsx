import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchMulti, Movie, TVShow } from '@/services/tmdb';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchMulti(query),
    enabled: query.length > 0,
  });

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  const getMediaType = (item: Movie | TVShow): 'movie' | 'tv' => {
    if ('media_type' in item) {
      return item.media_type === 'tv' ? 'tv' : 'movie';
    }
    return 'title' in item ? 'movie' : 'tv';
  };

  const filteredResults = data?.results.filter(
    (item) => item.media_type !== 'person' && (item.poster_path || item.backdrop_path)
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20 px-4 md:px-12">
        <div>
          {/* Search Input */}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="relative max-w-2xl mx-auto">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={24} />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search movies, TV shows, anime..."
                className="w-full bg-secondary text-foreground pl-14 pr-4 py-4 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>

          {/* Results */}
          {query ? (
            <>
              <h2 className="text-2xl font-bold mb-6">
                {isLoading ? 'Searching...' : `Results for "${query}"`}
              </h2>

              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[2/3] rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {filteredResults.map((item) => (
                    <MovieCard
                      key={item.id}
                      item={item}
                      type={getMediaType(item)}
                      className="w-full"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">No results found for "{query}"</p>
                  <p className="text-muted-foreground mt-2">Try a different search term</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <SearchIcon size={64} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">Start typing to search</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Search;