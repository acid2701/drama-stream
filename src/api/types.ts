export interface BaseMediaItem {
  id: string; // Unified string ID
  title: string;
  cover: string;
  provider: 'dramabox' | 'netshort' | 'melolo' | 'anime';
  type?: 'drama' | 'video' | 'movie';
  episodeCount?: number;
  score?: string; // e.g., "9.8"
}

export interface MediaDetail extends BaseMediaItem {
  synopsis?: string;
  releaseDate?: string;
  status?: string;
  genres?: string[];
  episodes: Episode[];
  related?: BaseMediaItem[];
}

export interface Episode {
  id: string; // Provider specific ID
  title: string;
  url?: string; // Stream URL if available immediately
  cover?: string;
  duration?: string;
}

// DRAMABOX types
export interface DramaboxItem {
  id: number | string;
  title: string;
  cover: string;
  total_episode?: number;
  score?: string;
}

// NETSHORT types
export interface NetshortItem {
  drama_id: number;
  title: string;
  cover: string;
  introduction?: string;
}

// MELOLO types
export interface MeloloItem {
  id: number;
  title: string;
  cover: string;
}

// ANIME types
export interface AnimeItem {
  url: string; // Anime API uses URL as ID often
  title: string;
  image: string;
}
