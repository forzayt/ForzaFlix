import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMovieDetails, getMovieVideos, getMovieCredits, getSimilarMovies, getBackdropUrl, getImageUrl } from '@/services/tmdb';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/VideoPlayer';
import StreamPlayer from '@/components/StreamPlayer';
import CastSection from '@/components/CastSection';
import MovieRow from '@/components/MovieRow';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Star, Clock, Calendar, Play } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled: !!movieId,
  });

  const { data: videos } = useQuery({
    queryKey: ['movieVideos', movieId],
    queryFn: () => getMovieVideos(movieId),
    enabled: !!movieId,
  });

  const { data: credits } = useQuery({
    queryKey: ['movieCredits', movieId],
    queryFn: () => getMovieCredits(movieId),
    enabled: !!movieId,
  });

  const { data: similar } = useQuery({
    queryKey: ['similarMovies', movieId],
    queryFn: () => getSimilarMovies(movieId),
    enabled: !!movieId,
  });

  const trailer = videos?.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube') || videos?.results[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <Skeleton className="h-[60vh] w-full" />
          <div className="px-4 md:px-12 py-8 space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 flex items-center justify-center h-[50vh]">
          <p className="text-muted-foreground text-xl">Movie not found</p>
        </div>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';

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
        <div className="px-4 md:px-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0 w-[200px] md:w-[300px] mx-auto md:mx-0">
              <img
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold mb-2">{movie.title}</h1>
                {movie.tagline && (
                  <p className="text-lg text-muted-foreground italic">{movie.tagline}</p>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star size={18} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-muted-foreground">({movie.vote_count} votes)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar size={16} />
                  <span>{year}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock size={16} />
                  <span>{runtime}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
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
                <p className="text-foreground/80 leading-relaxed">{movie.overview}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="gap-2"
                  onClick={() => document.getElementById('stream-player')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play size={20} fill="currentColor" />
                  Watch Now
                </Button>
              </div>
            </div>
          </div>

          {/* Stream Player */}
          <div id="stream-player" className="mt-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Play size={24} className="text-primary fill-primary" />
              Watch Now
            </h2>
            <StreamPlayer 
              id={movie.id} 
              type="movie" 
              title={movie.title} 
            />
          </div>

          {/* Trailer */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Watch Trailer</h2>
            <VideoPlayer video={trailer || null} title={movie.title} />
          </div>

          {/* Cast */}
          {credits?.cast && <CastSection cast={credits.cast} />}
        </div>

        {/* Similar Movies */}
        {similar?.results && similar.results.length > 0 && (
          <MovieRow
            title="Similar Movies"
            items={similar.results}
            type="movie"
            className="mt-8"
          />
        )}
      </div>

      <div className="pb-20" />
    </div>
  );
};

export default MovieDetails;