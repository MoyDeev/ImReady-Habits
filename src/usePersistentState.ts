// A small AsyncStorage-backed state hook that mirrors the hydration guard used by
// HabitsContext: it loads once on mount and only starts writing after hydration,
// so the empty initial value never clobbers what's still being read off disk.

import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [state, setState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(key);
        if (!cancelled && raw != null) {
          setState(JSON.parse(raw) as T);
        }
      } catch (err) {
        console.warn(`Failed to load ${key}`, err);
      } finally {
        if (!cancelled) {
          hydratedRef.current = true;
          setHydrated(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    AsyncStorage.setItem(key, JSON.stringify(state)).catch((err) =>
      console.warn(`Failed to save ${key}`, err),
    );
  }, [key, state]);

  return [state, setState, hydrated];
}
