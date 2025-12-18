import { Link } from 'react-router-dom';
import { Play, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBackdropUrl, Movie, TVShow } from '@/services/tmdb';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  items: (Movie | TVShow)[];
}

const HeroSection = ({ items }: HeroSectionProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 8000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  if (!items || items.length === 0) return null;

  return (
    <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      <div className="h-full w-full" ref={emblaRef}>
        <div className="flex h-full">
          {items.map((item) => {
            const title = 'title' in item ? item.title : item.name;
            const date = 'release_date' in item ? item.release_date : item.first_air_date;
            const year = date ? new Date(date).getFullYear() : '';
            const backdropUrl = getBackdropUrl(item.backdrop_path, 'original');
            const type = 'title' in item ? 'movie' : 'tv';

            return (
              <div key={item.id} className="relative flex-[0_0_100%] min-w-0 h-full">
                {/* Background Image */}
                {backdropUrl && (
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${backdropUrl})` }}
                  />
                )}

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-end pb-24 md:pb-32">
                  <div className="px-4 md:px-12 w-full">
                    <div className="max-w-2xl space-y-4 animate-fade-in text-left">
                      {/* Title */}
                      <h1 className="text-4xl md:text-6xl font-bold text-shadow line-clamp-2">{title}</h1>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm md:text-base">
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">{item.vote_average.toFixed(1)}</span>
                        </div>
                        <span className="text-muted-foreground">{year}</span>
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-semibold rounded">
                          {type === 'movie' ? 'MOVIE' : 'TV SERIES'}
                        </span>
                      </div>

                      {/* Overview */}
                      <p className="text-foreground/80 text-sm md:text-base line-clamp-3 max-w-xl">
                        {item.overview}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 pt-2">
                        <Button asChild size="lg" className="gap-2 focus:ring-4 focus:ring-primary/50">
                          <Link to={`/watch/${type}/${item.id}`}>
                            <Play size={20} fill="currentColor" />
                            Watch Now
                          </Link>
                        </Button>
                        <Button asChild variant="secondary" size="lg" className="gap-2 focus:ring-4 focus:ring-secondary/50">
                          <Link to={`/${type}/${item.id}`}>
                            <Info size={20} />
                            More Info
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 backdrop-blur-md p-3 rounded-full text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary opacity-0 md:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 backdrop-blur-md p-3 rounded-full text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary opacity-0 md:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all focus:outline-none",
              index === selectedIndex ? "bg-primary w-6" : "bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;