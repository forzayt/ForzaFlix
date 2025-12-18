import { Video } from '@/services/tmdb';

interface VideoPlayerProps {
  video: Video | null;
  title: string;
}

const VideoPlayer = ({ video, title }: VideoPlayerProps) => {
  if (!video || video.site !== 'YouTube') {
    return (
      <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No trailer available</p>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
      <iframe
        src={`https://www.youtube.com/embed/${video.key}?autoplay=0&rel=0`}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default VideoPlayer;