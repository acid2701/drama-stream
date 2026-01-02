import type { AnimeItem, BaseMediaItem, DramaboxItem, MeloloItem, NetshortItem } from './types';

export const normalizeDramabox = (item: any): BaseMediaItem => ({
  id: String(item.bookId || item.drama_id || item.id),
  title: item.title || item.bookName || item.name || 'Untitled',
  cover: item.cover || item.coverUrl || item.image || item.imageUrl || '',
  provider: 'dramabox',
  episodeCount: item.total_episode || item.chapterCount,
  score: item.score || item.hotCode,
});

export const normalizeNetshort = (item: NetshortItem): BaseMediaItem => ({
  id: String(item.drama_id),
  title: item.title,
  cover: item.cover,
  provider: 'netshort',
});

export const normalizeMelolo = (item: MeloloItem): BaseMediaItem => ({
  id: String(item.id),
  title: item.title,
  cover: item.cover,
  provider: 'melolo',
});

export const normalizeAnime = (item: AnimeItem): BaseMediaItem => {
    // Extract ID from URL if possible, or use the URL itself as ID (base64 encoded maybe if needed, but keeping simple for now)
    // Example URL: https://otakudesu.cloud/anime/one-piece-sub-indo/
    const id = item.url.split('/').filter(Boolean).pop() || item.url;
    
    return {
        id: id,
        title: item.title,
        cover: item.image,
        provider: 'anime',
    };
};
