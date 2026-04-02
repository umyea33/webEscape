import {
  defaultPlayerProgress,
  playerProgressStorageKey,
  sanitizePlayerProgress,
  type PlayerProgress,
} from './playerProgressStore.shared';

export type { PlayerProgress } from './playerProgressStore.shared';
export { defaultPlayerProgress } from './playerProgressStore.shared';

export function loadPlayerProgress(): PlayerProgress {
  const rawValue = globalThis.localStorage?.getItem(playerProgressStorageKey);

  if (!rawValue) {
    return defaultPlayerProgress;
  }

  try {
    return sanitizePlayerProgress(JSON.parse(rawValue));
  } catch {
    return defaultPlayerProgress;
  }
}

export function savePlayerProgress(progress: PlayerProgress) {
  globalThis.localStorage?.setItem(playerProgressStorageKey, JSON.stringify(sanitizePlayerProgress(progress)));
}
