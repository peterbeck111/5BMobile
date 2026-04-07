import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Product } from '../data/products';
import { products } from '../data/products';

interface WatchlistContextType {
  watchlist: Product[];
  addToWatchlist: (product: Product) => void;
  removeFromWatchlist: (productId: string) => void;
  isWatching: (productId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const dumpling = products.find((p) => p.id === '5')!;
  const [watchlist, setWatchlist] = useState<Product[]>([dumpling]);

  const addToWatchlist = useCallback((product: Product) => {
    setWatchlist((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromWatchlist = useCallback((productId: string) => {
    setWatchlist((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const isWatching = useCallback(
    (productId: string) => watchlist.some((p) => p.id === productId),
    [watchlist]
  );

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isWatching }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
}
