import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Home } from 'lucide-react';
import { getMovieDetails, getTVShowDetails } from '@/services/tmdb';
import StreamPlayer from '@/components/StreamPlayer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const Player = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const itemId = Number(id);
  const season = Number(searchParams.get('s')) || 1;
  const episode = Number(searchParams.get('e')) || 1;

  const { data: item, isLoading } = useQuery({
    queryKey: [type, itemId],
    queryFn: () => type === 'movie' ? getMovieDetails(itemId) : getTVShowDetails(itemId),
    enabled: !!itemId && (type === 'movie' || type === 'tv' || type === 'anime'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-4xl px-4 space-y-4">
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

  const title = 'title' in item ? item.title : item.name;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <div className="p-4 md:px-8 flex items-center justify-between bg-gradient-to-b from-background to-transparent">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-secondary"
          >
            <ChevronLeft size={24} />
          </Button>
          <div>
            <h1 className="text-lg md:text-xl font-bold line-clamp-1">{title}</h1>
            {type !== 'movie' && (
              <p className="text-xs text-muted-foreground">
                Season {season}, Episode {episode}
              </p>
            )}
          </div>
        </div>
        <Link to="/">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
            <Home size={24} />
          </Button>
        </Link>
      </div>

      {/* Player Container */}
      <main className="px-4 md:px-12 py-4">
        <div className="max-w-6xl mx-auto">
          <StreamPlayer 
            id={itemId} 
            type={type as 'movie' | 'tv' | 'anime'} 
            season={season} 
            episode={episode} 
            title={title} 
          />
          
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{title}</h2>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded">
                  {type?.toUpperCase()}
                </span>
                <span className="text-muted-foreground text-sm">
                  {'release_date' in item ? new Date(item.release_date).getFullYear() : new Date(item.first_air_date).getFullYear()}
                </span>
              </div>
            </div>
            <p className="text-foreground/80 leading-relaxed max-w-3xl">
              {item.overview}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Player;
