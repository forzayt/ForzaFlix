import { Genre } from '@/services/tmdb';
import { cn } from '@/lib/utils';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: string | null;
  onSelectGenre: (genreId: string | null) => void;
}

const GenreFilter = ({ genres, selectedGenre, onSelectGenre }: GenreFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectGenre(null)}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium transition-colors',
          !selectedGenre
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        )}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelectGenre(String(genre.id))}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedGenre === String(genre.id)
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;