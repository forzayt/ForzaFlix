import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Home, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { getMovieDetails, getTVShowDetails, MovieDetails, TVShowDetails } from '@/services/tmdb';
import StreamPlayer from '@/components/StreamPlayer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveToContinueWatching } from '@/lib/continueWatching';

const Player = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const itemId = Number(id);
  const season = Number(searchParams.get('s')) || 1;
  const episode = Number(searchParams.get('e')) || 1;

  const { data: item, isLoading } = useQuery({
    queryKey: [type, itemId],
    queryFn: async () => {
      if (type === 'movie') return getMovieDetails(itemId);
      // For anime and tv, we try tv details first. 
      // If it's an anime movie, this might need refinement, but usually anime in TMDB are either movie or tv.
      return getTVShowDetails(itemId);
    },
    enabled: !!itemId && (type === 'movie' || type === 'tv' || type === 'anime'),
  });

  const isMovie = type === 'movie';
  const movieItem = isMovie ? item as MovieDetails : null;
  const tvItem = !isMovie ? item as TVShowDetails : null;

  useEffect(() => {
    if (item) {
      saveToContinueWatching({
        id: itemId,
        type: type as 'movie' | 'tv' | 'anime',
        title: movieItem ? movieItem.title : tvItem?.name || '',
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        season: isMovie ? undefined : season,
        episode: isMovie ? undefined : episode,
        timestamp: Date.now(),
      });
    }
  }, [item, itemId, type, season, episode, isMovie, movieItem, tvItem]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-[1600px] px-4 space-y-4">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="h-8 w-1/3" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Content not found</h1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const title = movieItem ? movieItem.title : tvItem?.name || '';
  const date = movieItem ? movieItem.release_date : tvItem?.first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';

  const handleSeasonChange = (s: string) => {
    setSearchParams({ s, e: '1' });
  };

  const handleEpisodeChange = (e: string) => {
    setSearchParams({ s: String(season), e });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <div className="p-4 md:px-8 flex items-center justify-between bg-gradient-to-b from-background to-transparent border-b border-white/5">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-secondary focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ChevronLeft size={24} />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-bold line-clamp-1">{title}</h1>
            {!isMovie && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span>Season {season}</span>
                <ChevronRight size={12} />
                <span>Episode {episode}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {!isMovie && tvItem && (
            <div className="hidden md:flex items-center gap-2">
              <Select value={String(season)} onValueChange={handleSeasonChange}>
                <SelectTrigger className="w-[120px] bg-secondary/50 border-none focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  {tvItem.seasons?.filter(s => s.season_number > 0).map((s) => (
                    <SelectItem key={s.id} value={String(s.season_number)}>
                      Season {s.season_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={String(episode)} onValueChange={handleEpisodeChange}>
                <SelectTrigger className="w-[120px] bg-secondary/50 border-none focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Episode" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ 
                    length: tvItem.seasons?.find(s => s.season_number === season)?.episode_count || 0 
                  }).map((_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      Episode {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary">
              <Home size={24} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Player Container */}
      <main className="px-4 md:px-12 py-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="relative group">
            <StreamPlayer 
              id={itemId} 
              type={type as 'movie' | 'tv' | 'anime'} 
              season={season} 
              episode={episode} 
              title={title} 
            />
          </div>
          
          {/* Mobile Selectors */}
          {!isMovie && tvItem && (
            <div className="flex md:hidden items-center gap-2 mt-4">
              <Select value={String(season)} onValueChange={handleSeasonChange}>
                <SelectTrigger className="flex-1 bg-secondary/50 border-none">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  {tvItem.seasons?.filter(s => s.season_number > 0).map((s) => (
                    <SelectItem key={s.id} value={String(s.season_number)}>
                      S{s.season_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={String(episode)} onValueChange={handleEpisodeChange}>
                <SelectTrigger className="flex-1 bg-secondary/50 border-none">
                  <SelectValue placeholder="Episode" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ 
                    length: tvItem.seasons?.find(s => s.season_number === season)?.episode_count || 0 
                  }).map((_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      E{i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                  {type}
                </span>
                <span className="text-muted-foreground font-medium">
                  {year}
                </span>
                {movieItem?.runtime && (
                  <span className="text-muted-foreground font-medium">
                    {Math.floor(movieItem.runtime / 60)}h {movieItem.runtime % 60}m
                  </span>
                )}
              </div>
            </div>
            
            <div className="h-px bg-white/5 w-full" />
            
            <p className="text-foreground/80 leading-relaxed max-w-4xl text-lg">
              {item.overview}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Player;
