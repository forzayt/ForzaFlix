import { useState } from 'react';
import { cn } from '@/lib/utils';
import { STREAM_BASE_URL } from '@/constants/streamConstants';

interface StreamPlayerProps {
  id: number;
  type: 'movie' | 'tv' | 'anime';
  season?: number;
  episode?: number;
  title: string;
}

const StreamPlayer = ({ id, type, season = 1, episode = 1, title }: StreamPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const getStreamUrl = () => {
    const color = 'E11D48'; // Primary theme color without #
    const commonParams = `color=${color}&nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true`;

    if (type === 'movie') {
      return `${STREAM_BASE_URL}/movie/${id}?${commonParams}`;
    } else if (type === 'tv') {
      return `${STREAM_BASE_URL}/tv/${id}/${season}/${episode}?${commonParams}`;
    } else if (type === 'anime') {
      return `${STREAM_BASE_URL}/anime/${id}/${episode}?${commonParams}`;
    }
    return '';
  };

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary animate-pulse">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse">Loading Stream...</p>
          </div>
        </div>
      )}
      <iframe
        src={getStreamUrl()}
        title={title}
        className={cn(
          "w-full h-full border-0 transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default StreamPlayer;
