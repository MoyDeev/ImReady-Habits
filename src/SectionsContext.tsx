// Shared state for the horizontal section pager (Hábitos · Gastos · Notas ·
// Pendientes). Owns the animated horizontal offset plus the active index, so the
// pager (gesture) and the FloatingDock (taps) stay in sync.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useWindowDimensions } from 'react-native';
import {
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

export const SECTION_KEYS = ['habits', 'expenses', 'notes', 'todos'] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

type SectionsValue = {
  /** Active panel index (React state — drives dock highlight). */
  index: number;
  count: number;
  /** Panel width in px (full screen width). */
  width: number;
  /** Animated horizontal offset of the panel row (negative = further right). */
  translateX: SharedValue<number>;
  /** Animate to a panel and set the active index (used by the dock). */
  goTo: (i: number, animated?: boolean) => void;
  /** Set the active index only (used by the pager after a swipe settles). */
  setActive: (i: number) => void;
};

const SectionsContext = createContext<SectionsValue | null>(null);

export function SectionsProvider({
  count,
  children,
}: {
  count: number;
  children: React.ReactNode;
}) {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (i: number, animated = true) => {
      const clamped = Math.max(0, Math.min(count - 1, i));
      const to = -clamped * width;
      translateX.value = animated ? withTiming(to, { duration: 240 }) : to;
      setIndex(clamped);
    },
    [count, width, translateX],
  );

  const setActive = useCallback(
    (i: number) => setIndex(Math.max(0, Math.min(count - 1, i))),
    [count],
  );

  // Keep the offset aligned to the active panel when the width changes
  // (e.g. rotation or first real measurement).
  useEffect(() => {
    translateX.value = -index * width;
  }, [width, index, translateX]);

  const value = useMemo<SectionsValue>(
    () => ({ index, count, width, translateX, goTo, setActive }),
    [index, count, width, translateX, goTo, setActive],
  );

  return (
    <SectionsContext.Provider value={value}>
      {children}
    </SectionsContext.Provider>
  );
}

export function useSections(): SectionsValue {
  const ctx = useContext(SectionsContext);
  if (!ctx) {
    throw new Error('useSections must be used inside a SectionsProvider');
  }
  return ctx;
}
