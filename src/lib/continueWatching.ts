export interface ContinueWatchingItem {
  id: number;
  type: 'movie' | 'tv' | 'anime';
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  season?: number;
  episode?: number;
  timestamp: number;
}

const STORAGE_KEY = 'forzaflix_continue_watching';
const MAX_ITEMS = 12;

export const getContinueWatching = (): ContinueWatchingItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading continue watching', e);
    return [];
  }
};

export const saveToContinueWatching = (item: ContinueWatchingItem) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = getContinueWatching();
    const filtered = existing.filter(i => !(i.id === item.id && i.type === item.type));
    const updated = [item, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving continue watching', e);
  }
};

export const removeFromContinueWatching = (id: number, type: string) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = getContinueWatching();
    const updated = existing.filter(i => !(i.id === id && i.type === type));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error removing continue watching', e);
  }
};
