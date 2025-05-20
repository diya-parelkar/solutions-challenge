export default class CacheService {
    private readonly MAX_ITEM_SIZE = 1024 * 1024; // 1MB per item
    private readonly CLEANUP_THRESHOLD = 0.9; // 90% of storage used

    // Get an item from localStorage
    public get(key: string): string | null {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error(`Error retrieving item with key ${key} from cache:`, error);
        return null;
      }
    }
  
    // Set an item in localStorage with size checks and cleanup
    public set(key: string, value: string): boolean {
      try {
        // Check if the item is too large
        if (this.getItemSize(key, value) > this.MAX_ITEM_SIZE) {
          console.warn(`Item ${key} is too large to cache (${this.getItemSize(key, value)} bytes)`);
          return false;
        }

        // Check storage usage and cleanup if needed
        const storageInfo = this.getStorageInfo();
        if (storageInfo.percentage > this.CLEANUP_THRESHOLD) {
          this.cleanup();
        }

        // Try to set the item
        localStorage.setItem(key, value);
        return true;
      } catch (error) {
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.warn('Storage quota exceeded, attempting cleanup...');
          this.cleanup();
          try {
            localStorage.setItem(key, value);
            return true;
          } catch (retryError) {
            console.error(`Failed to store item after cleanup: ${key}`, retryError);
            return false;
          }
        }
        console.error(`Error setting item with key ${key} in cache:`, error);
        return false;
      }
    }
  
    // Remove an item from localStorage
    public remove(key: string): boolean {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error(`Error removing item with key ${key} from cache:`, error);
        return false;
      }
    }
  
    // Clear all items from localStorage
    public clear(): boolean {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.error("Error clearing cache:", error);
        return false;
      }
    }
  
    // Check if an item exists in localStorage
    public hasItem(key: string): boolean {
      return localStorage.getItem(key) !== null;
    }
  
    // Get all keys that match a certain pattern
    public getKeysByPrefix(prefix: string): string[] {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      return keys;
    }
  
    // Clear all items with keys matching a certain pattern
    public clearByPrefix(prefix: string): number {
      const keys = this.getKeysByPrefix(prefix);
      keys.forEach(key => localStorage.removeItem(key));
      return keys.length;
    }
  
    // Get storage usage info
    public getStorageInfo(): { used: number, total: number, percentage: number } {
      let used = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          used += this.getItemSize(key, value);
        }
      }
      
      // Convert to MB for easier reading
      const usedMB = used / (1024 * 1024);
      
      // Estimate total available (usually around 5MB for most browsers)
      const totalMB = 5;
      
      return {
        used: usedMB,
        total: totalMB,
        percentage: (usedMB / totalMB) * 100
      };
    }

    // Calculate size of an item in bytes
    private getItemSize(key: string, value: string): number {
      return (key.length + value.length) * 2; // UTF-16 uses 2 bytes per character
    }

    // Cleanup old items when storage is nearly full
    private cleanup(): void {
      try {
        const storageInfo = this.getStorageInfo();
        if (storageInfo.percentage <= this.CLEANUP_THRESHOLD) {
          return;
        }

        // Get all keys and their sizes
        const items: { key: string; size: number; timestamp: number }[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const value = localStorage.getItem(key) || '';
            const size = this.getItemSize(key, value);
            // Try to get timestamp from key (assuming format: prefix-timestamp)
            const timestamp = parseInt(key.split('-').pop() || '0');
            items.push({ key, size, timestamp });
          }
        }

        // Sort by timestamp (oldest first)
        items.sort((a, b) => a.timestamp - b.timestamp);

        // Remove items until we're below threshold
        let currentUsage = storageInfo.used * 1024 * 1024; // Convert MB to bytes
        const targetUsage = this.CLEANUP_THRESHOLD * 5 * 1024 * 1024; // 90% of 5MB

        for (const item of items) {
          if (currentUsage <= targetUsage) break;
          localStorage.removeItem(item.key);
          currentUsage -= item.size;
        }

        console.log(`Cache cleanup completed. New usage: ${(currentUsage / (1024 * 1024)).toFixed(2)}MB`);
      } catch (error) {
        console.error('Error during cache cleanup:', error);
      }
    }
  }