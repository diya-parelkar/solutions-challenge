export default class CacheService {
    // Get an item from localStorage
    public get(key: string): string | null {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error(`Error retrieving item with key ${key} from cache:`, error);
        return null;
      }
    }
  
    // Set an item in localStorage
    public set(key: string, value: string): boolean {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (error) {
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
          used += key.length + value.length;
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
  }