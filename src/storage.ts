// AsyncStorage persistence with v1 -> v2 migration on load.

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppState } from './types';
import { CURRENT_VERSION, migrateState } from './dates';

const STORAGE_KEY = 'imready-habits/state/v1';

export const emptyState: AppState = {
  version: CURRENT_VERSION,
  habits: [],
  completions: {},
};

export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyState };
    const parsed = JSON.parse(raw);
    return migrateState(parsed);
  } catch (err) {
    console.warn('Failed to load state, starting empty', err);
    return { ...emptyState };
  }
}

export async function saveState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save state', err);
  }
}
