export type PlayerProgress = {
  currentLevelNumber: number;
  levelsCompleted: number;
  totalAttempts: number;
  totalMistakes: number;
  perfectClears: number;
};

export type PlayerProgressRow = Partial<PlayerProgress>;

export const playerProgressStorageKey = 'webescape.player-progress.v1';

export const defaultPlayerProgress: PlayerProgress = {
  currentLevelNumber: 1,
  levelsCompleted: 0,
  totalAttempts: 0,
  totalMistakes: 0,
  perfectClears: 0,
};

export function sanitizePlayerProgress(progress: PlayerProgressRow): PlayerProgress {
  return {
    currentLevelNumber: integerAtLeast(progress.currentLevelNumber, defaultPlayerProgress.currentLevelNumber, 1),
    levelsCompleted: integerAtLeast(progress.levelsCompleted, defaultPlayerProgress.levelsCompleted, 0),
    totalAttempts: integerAtLeast(progress.totalAttempts, defaultPlayerProgress.totalAttempts, 0),
    totalMistakes: integerAtLeast(progress.totalMistakes, defaultPlayerProgress.totalMistakes, 0),
    perfectClears: integerAtLeast(progress.perfectClears, defaultPlayerProgress.perfectClears, 0),
  };
}

function integerAtLeast(value: number | undefined, fallback: number, minimumValue: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(minimumValue, Math.floor(value));
}
