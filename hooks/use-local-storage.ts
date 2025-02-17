'use client';

import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Custom event name
  const localStorageEventName = 'localStorageChange';

  // State to store our value
  // Pass initial state function to useState so logic is only executed once on the client
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Dispatch custom event
        window.dispatchEvent(new StorageEvent(localStorageEventName, { key, newValue: JSON.stringify(valueToStore) }));
      }
    } catch (error) {
      console.error("Error setting localStorage:", error);
    }
  }, [key, storedValue]);

  // Function to decrement tokens, returning true on success, false on failure
  const decrementToken = useCallback((): boolean => {
      let success = false;
      setValue((prevTokens: any) => {
          const currentTokens = typeof prevTokens === 'number' ? prevTokens : 0;
          if (currentTokens > 0) {
              success = true;
              return currentTokens - 1;
          }
          return currentTokens; // Return original value if not enough tokens
      });
      return success;
  }, [setValue]);

  return [storedValue, setValue, decrementToken] as const;
}
