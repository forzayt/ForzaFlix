import { Cast, getImageUrl } from '@/services/tmdb';

interface CastSectionProps {
  cast: Cast[];
}

const CastSection = ({ cast }: CastSectionProps) => {
  if (!cast.length) return null;

  return (
    <section className="py-8">
      <h2 className="text-xl font-bold mb-4">Cast</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {cast.slice(0, 10).map((person) => (
          <div key={person.id} className="flex-shrink-0 w-[120px] text-center">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-secondary mx-auto">
              <img
                src={getImageUrl(person.profile_path, 'w200')}
                alt={person.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-sm font-medium line-clamp-2">{person.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{person.character}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CastSection;