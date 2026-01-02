import { useState, useEffect } from 'react';
import type { BaseMediaItem } from '../api/types';

const KEY = 'drama-stream-history';

export interface HistoryItem extends BaseMediaItem {
  lastEpisode: string;
  lastEpisodeId: string;
  timestamp: number;
}

export function useContinueWatching() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveHistory = (item: BaseMediaItem, episode: string, episodeId: string) => {
    setHistory((prev) => {
      // Remove existing entry for same ID
      const filtered = prev.filter((i) => !(i.id === item.id && i.provider === item.provider));
      // Add new to top
      const newItem: HistoryItem = {
        ...item,
        lastEpisode: episode,
        lastEpisodeId: episodeId,
        timestamp: Date.now(),
      };
      const newHistory = [newItem, ...filtered].slice(0, 20); // Keep max 20
      localStorage.setItem(KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const removeFromHistory = (id: string, provider: string) => {
      setHistory((prev) => {
          const newHistory = prev.filter((i) => !(i.id === id && i.provider === provider));
          localStorage.setItem(KEY, JSON.stringify(newHistory));
          return newHistory;
      });
  };

  return { history, saveHistory, removeFromHistory };
}
