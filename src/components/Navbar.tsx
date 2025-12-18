import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/tv-series', label: 'TV Series' },
    { to: '/anime', label: 'Anime' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-12 py-4',
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-background/80 to-transparent'
      )}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2 py-1 transition-all">
          <span className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
            ForzaFlix
          </span>
        </Link>

        {/* Desktop Navigation & Search */}
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md px-2 py-1 whitespace-nowrap',
                  isActive(link.to) ? 'text-primary' : 'text-foreground/80'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Search Button */}
            <Link
              to="/search"
              className={cn(
                "p-2 hover:bg-secondary/50 focus:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary rounded-full transition-colors",
                isActive('/search') && "text-primary bg-secondary/50"
              )}
              aria-label="Search"
            >
              <Search size={20} />
            </Link>

            {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-secondary/50 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </div>

    {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border animate-fade-in">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'text-lg font-medium py-2 transition-colors',
                  isActive(link.to) ? 'text-primary' : 'text-foreground/80'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;