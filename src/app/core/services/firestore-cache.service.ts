import { Injectable } from '@angular/core';

interface CacheEntry {
  data: any[];
  timestamp: number;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreCacheService {
  private cache = new Map<string, CacheEntry>();
  private readonly TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

  /**
   * Get cached data for a collection path
   * Returns null if cache miss or expired
   */
  get(path: string): any[] | null {
    const entry = this.cache.get(path);
    
    if (!entry) {
      console.log(`[Cache] MISS: ${path}`);
      return null;
    }

    if (!this.isValid(entry)) {
      console.log(`[Cache] EXPIRED: ${path}`);
      this.cache.delete(path);
      return null;
    }

    console.log(`[Cache] HIT: ${path}`);
    return entry.data;
  }

  /**
   * Store data in cache with 30-minute expiration
   */
  set(path: string, data: any[]): void {
    const now = Date.now();
    const entry: CacheEntry = {
      data,
      timestamp: now,
      expiresAt: now + this.TTL
    };
    
    this.cache.set(path, entry);
    console.log(`[Cache] SET: ${path} (${data.length} items, expires in 30min)`);
  }

  /**
   * Invalidate cache for a specific collection path
   */
  invalidate(path: string): void {
    if (this.cache.has(path)) {
      this.cache.delete(path);
      console.log(`[Cache] INVALIDATED: ${path}`);
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    console.log('[Cache] CLEARED all entries');
  }

  /**
   * Check if a cache entry is still valid
   */
  private isValid(entry: CacheEntry): boolean {
    return Date.now() < entry.expiresAt;
  }

  /**
   * Get cache statistics (for debugging)
   */
  getStats(): { size: number; entries: Array<{ path: string; items: number; expiresIn: number }> } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([path, entry]) => ({
      path,
      items: entry.data.length,
      expiresIn: Math.max(0, entry.expiresAt - now)
    }));

    return {
      size: this.cache.size,
      entries
    };
  }
}
