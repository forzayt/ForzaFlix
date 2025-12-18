const API_KEY = 'b8e31efed6de570178942a39601e84b0';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'original') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

const fetchTMDB = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const searchParams = new URLSearchParams({ api_key: API_KEY, ...params });
  const response = await fetch(`${BASE_URL}${endpoint}?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
};

// Types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  media_type?: string;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  media_type?: string;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string | null }[];
}

export interface TVShowDetails extends TVShow {
  genres: { id: number; name: string }[];
  episode_run_time: number[];
  tagline: string;
  status: string;
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    poster_path: string | null;
    air_date: string;
  }[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Trending
export const getTrending = (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week') =>
  fetchTMDB<PaginatedResponse<Movie | TVShow>>(`/trending/${mediaType}/${timeWindow}`);

// Movies
export const getPopularMovies = (page = 1) =>
  fetchTMDB<PaginatedResponse<Movie>>('/movie/popular', { page: String(page) });

export const getTopRatedMovies = (page = 1) =>
  fetchTMDB<PaginatedResponse<Movie>>('/movie/top_rated', { page: String(page) });

export const getNowPlayingMovies = (page = 1) =>
  fetchTMDB<PaginatedResponse<Movie>>('/movie/now_playing', { page: String(page) });

export const getUpcomingMovies = (page = 1) =>
  fetchTMDB<PaginatedResponse<Movie>>('/movie/upcoming', { page: String(page) });

export const getMovieDetails = (id: number) =>
  fetchTMDB<MovieDetails>(`/movie/${id}`);

export const getMovieVideos = (id: number) =>
  fetchTMDB<{ results: Video[] }>(`/movie/${id}/videos`);

export const getMovieCredits = (id: number) =>
  fetchTMDB<{ cast: Cast[] }>(`/movie/${id}/credits`);

export const getSimilarMovies = (id: number) =>
  fetchTMDB<PaginatedResponse<Movie>>(`/movie/${id}/similar`);

export const discoverMovies = (params: { page?: number; with_genres?: string; sort_by?: string; year?: string }) =>
  fetchTMDB<PaginatedResponse<Movie>>('/discover/movie', {
    page: String(params.page || 1),
    ...(params.with_genres && { with_genres: params.with_genres }),
    ...(params.sort_by && { sort_by: params.sort_by }),
    ...(params.year && { year: params.year }),
  });

// TV Shows
export const getPopularTVShows = (page = 1) =>
  fetchTMDB<PaginatedResponse<TVShow>>('/tv/popular', { page: String(page) });

export const getTopRatedTVShows = (page = 1) =>
  fetchTMDB<PaginatedResponse<TVShow>>('/tv/top_rated', { page: String(page) });

export const getOnTheAirTVShows = (page = 1) =>
  fetchTMDB<PaginatedResponse<TVShow>>('/tv/on_the_air', { page: String(page) });

export const getTVShowDetails = (id: number) =>
  fetchTMDB<TVShowDetails>(`/tv/${id}`);

export const getTVShowVideos = (id: number) =>
  fetchTMDB<{ results: Video[] }>(`/tv/${id}/videos`);

export const getTVShowCredits = (id: number) =>
  fetchTMDB<{ cast: Cast[] }>(`/tv/${id}/credits`);

export const getSimilarTVShows = (id: number) =>
  fetchTMDB<PaginatedResponse<TVShow>>(`/tv/${id}/similar`);

export const discoverTVShows = (params: { page?: number; with_genres?: string; sort_by?: string }) =>
  fetchTMDB<PaginatedResponse<TVShow>>('/discover/tv', {
    page: String(params.page || 1),
    ...(params.with_genres && { with_genres: params.with_genres }),
    ...(params.sort_by && { sort_by: params.sort_by }),
  });

// Anime (using animation genre 16 for Japanese content)
export const getAnimeMovies = (page = 1) =>
  fetchTMDB<PaginatedResponse<Movie>>('/discover/movie', {
    page: String(page),
    with_genres: '16',
    with_original_language: 'ja',
    sort_by: 'popularity.desc',
  });

export const getAnimeTVShows = (page = 1) =>
  fetchTMDB<PaginatedResponse<TVShow>>('/discover/tv', {
    page: String(page),
    with_genres: '16',
    with_original_language: 'ja',
    sort_by: 'popularity.desc',
  });

// Search
export const searchMulti = (query: string, page = 1) =>
  fetchTMDB<PaginatedResponse<Movie | TVShow>>('/search/multi', { query, page: String(page) });

export const searchMovies = (query: string, page = 1) =>
  fetchTMDB<PaginatedResponse<Movie>>('/search/movie', { query, page: String(page) });

export const searchTVShows = (query: string, page = 1) =>
  fetchTMDB<PaginatedResponse<TVShow>>('/search/tv', { query, page: String(page) });

// Genres
export const getMovieGenres = () =>
  fetchTMDB<{ genres: Genre[] }>('/genre/movie/list');

export const getTVGenres = () =>
  fetchTMDB<{ genres: Genre[] }>('/genre/tv/list');

export const getIndianMovies = (page = 1) =>
  fetchTMDB<PaginatedResponse<Movie>>('/discover/movie', {
    page: String(page),
    with_original_language: 'hi|te|ta|kn|ml',
    region: 'IN',
    sort_by: 'popularity.desc',
  });