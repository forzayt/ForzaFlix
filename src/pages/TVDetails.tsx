import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTVShowDetails, getTVShowVideos, getTVShowCredits, getSimilarTVShows, getBackdropUrl, getImageUrl } from '@/services/tmdb';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/VideoPlayer';
import CastSection from '@/components/CastSection';
import MovieRow from '@/components/MovieRow';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Calendar, Tv } from 'lucide-react';

const TVDetails = () => {
  const { id } = useParams<{ id: string }>();
  const tvId = Number(id);

  const { data: show, isLoading } = useQuery({
    queryKey: ['tvshow', tvId],
    queryFn: () => getTVShowDetails(tvId),
    enabled: !!tvId,
  });

  const { data: videos } = useQuery({
    queryKey: ['tvVideos', tvId],
    queryFn: () => getTVShowVideos(tvId),
    enabled: !!tvId,
  });

  const { data: credits } = useQuery({
    queryKey: ['tvCredits', tvId],
    queryFn: () => getTVShowCredits(tvId),
    enabled: !!tvId,
  });

  const { data: similar } = useQuery({
    queryKey: ['similarTV', tvId],
    queryFn: () => getSimilarTVShows(tvId),
    enabled: !!tvId,
  });

  const trailer = videos?.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube') || videos?.results[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <Skeleton className="h-[60vh] w-full" />
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 flex items-center justify-center h-[50vh]">
          <p className="text-muted-foreground text-xl">TV Show not found</p>
        </div>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(show.backdrop_path, 'original');
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-[60vh] md:h-[70vh]">
        {backdropUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative -mt-64 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0 w-[200px] md:w-[300px] mx-auto md:mx-0">
              <img
                src={getImageUrl(show.poster_path, 'w500')}
                alt={show.name}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold mb-2">{show.name}</h1>
                {show.tagline && (
                  <p className="text-lg text-muted-foreground italic">{show.tagline}</p>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star size={18} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{show.vote_average.toFixed(1)}</span>
                  <span className="text-muted-foreground">({show.vote_count} votes)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar size={16} />
                  <span>{year}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Tv size={16} />
                  <span>{show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}</span>
                </div>
                <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-semibold rounded">
                  {show.status}
                </span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {show.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Overview</h3>
                <p className="text-foreground/80 leading-relaxed">{show.overview}</p>
              </div>
            </div>
          </div>

          {/* Trailer */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Watch Trailer</h2>
            <VideoPlayer video={trailer || null} title={show.name} />
          </div>

          {/* Seasons */}
          {show.seasons && show.seasons.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Seasons</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {show.seasons.filter(s => s.season_number > 0).map((season) => (
                  <div key={season.id} className="bg-card rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(season.poster_path, 'w300')}
                      alt={season.name}
                      className="w-full aspect-[2/3] object-cover"
                    />
                    <div className="p-3">
                      <p className="font-medium text-sm line-clamp-1">{season.name}</p>
                      <p className="text-xs text-muted-foreground">{season.episode_count} Episodes</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cast */}
          {credits?.cast && <CastSection cast={credits.cast} />}

          {/* Similar Shows */}
          {similar?.results && similar.results.length > 0 && (
            <MovieRow
              title="Similar TV Shows"
              items={similar.results}
              type="tv"
              className="mt-8"
            />
          )}
        </div>
      </div>

      <div className="pb-20" />
    </div>
  );
};

export default TVDetails;