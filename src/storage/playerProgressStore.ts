import 'expo-sqlite/localStorage/install';

export type PlayerProgress = {
  currentLevelNumber: number;
  levelsCompleted: number;
  totalAttempts: number;
  totalMistakes: number;
  perfectClears: number;
};

const STORAGE_KEY = 'webescape.player-progress.v1';

export const defaultPlayerProgress: PlayerProgress = {
  currentLevelNumber: 1,
  levelsCompleted: 0,
  totalAttempts: 0,
  totalMistakes: 0,
  perfectClears: 0,
};

export function loadPlayerProgress(): PlayerProgress {
  const rawValue = globalThis.localStorage?.getItem(STORAGE_KEY);

  if (!rawValue) {
    return defaultPlayerProgress;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<PlayerProgress>;

    return {
      currentLevelNumber: integerAtLeast(parsedValue.currentLevelNumber, defaultPlayerProgress.currentLevelNumber, 1),
      levelsCompleted: integerAtLeast(parsedValue.levelsCompleted, defaultPlayerProgress.levelsCompleted, 0),
      totalAttempts: integerAtLeast(parsedValue.totalAttempts, defaultPlayerProgress.totalAttempts, 0),
      totalMistakes: integerAtLeast(parsedValue.totalMistakes, defaultPlayerProgress.totalMistakes, 0),
      perfectClears: integerAtLeast(parsedValue.perfectClears, defaultPlayerProgress.perfectClears, 0),
    };
  } catch {
    return defaultPlayerProgress;
  }
}

export function savePlayerProgress(progress: PlayerProgress) {
  globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function integerAtLeast(value: number | undefined, fallback: number, minimumValue: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(minimumValue, Math.floor(value));
}
