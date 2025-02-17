'use client';

import { useState, useCallback, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Custom event name
  const localStorageEventName = 'localStorageChange';

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

  const decrementToken = useCallback((): boolean => {
      let success = false;
      setValue((prevTokens: any) => {
          const currentTokens = typeof prevTokens === 'number' ? prevTokens : 0;
          if (currentTokens > 0) {
              success = true;
              return currentTokens - 1;
          }
          return currentTokens;
      });
      return success;
  }, [setValue]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.error("Error parsing localStorage value:", error);
                }
            }
        };

        window.addEventListener(localStorageEventName, handleStorageChange);

        return () => {
            window.removeEventListener(localStorageEventName, handleStorageChange);
        };
    }, [key]);

  return [storedValue, setValue, decrementToken] as const;
}
