import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';
import { Storage as LegacySQLiteStorage } from 'expo-sqlite/kv-store';

import {
  defaultPlayerProgress,
  playerProgressStorageKey,
  sanitizePlayerProgress,
  type PlayerProgress,
  type PlayerProgressRow,
} from './playerProgressStore.shared';

export type { PlayerProgress } from './playerProgressStore.shared';
export { defaultPlayerProgress } from './playerProgressStore.shared';

const DATABASE_NAME = 'webescape.db';
const PLAYER_PROGRESS_ROW_ID = 1;

let database: SQLiteDatabase | null = null;
let didPrepareNativeDatabase = false;

export function loadPlayerProgress(): PlayerProgress {
  const nativeDatabase = getNativeDatabase();
  const persistedProgress = nativeDatabase.getFirstSync<PlayerProgressRow>(
    `SELECT
      current_level_number AS currentLevelNumber,
      levels_completed AS levelsCompleted,
      total_attempts AS totalAttempts,
      total_mistakes AS totalMistakes,
      perfect_clears AS perfectClears
    FROM player_progress
    WHERE id = ?;`,
    PLAYER_PROGRESS_ROW_ID,
  );

  if (persistedProgress) {
    return sanitizePlayerProgress(persistedProgress);
  }

  const migratedProgress = migrateLegacyNativeProgress(nativeDatabase);

  if (migratedProgress) {
    return migratedProgress;
  }

  writeNativePlayerProgress(nativeDatabase, defaultPlayerProgress);

  return defaultPlayerProgress;
}

export function savePlayerProgress(progress: PlayerProgress) {
  writeNativePlayerProgress(getNativeDatabase(), sanitizePlayerProgress(progress));
}

function getNativeDatabase(): SQLiteDatabase {
  if (!database) {
    database = openDatabaseSync(DATABASE_NAME);
  }

  const nativeDatabase = database;

  if (!didPrepareNativeDatabase) {
    nativeDatabase.execSync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS player_progress (
        id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
        current_level_number INTEGER NOT NULL,
        levels_completed INTEGER NOT NULL,
        total_attempts INTEGER NOT NULL,
        total_mistakes INTEGER NOT NULL,
        perfect_clears INTEGER NOT NULL
      );
    `);
    didPrepareNativeDatabase = true;
  }

  return nativeDatabase;
}

function migrateLegacyNativeProgress(nativeDatabase: SQLiteDatabase) {
  const rawLegacyValue = LegacySQLiteStorage.getItemSync(playerProgressStorageKey);

  if (!rawLegacyValue) {
    return null;
  }

  try {
    const migratedProgress = sanitizePlayerProgress(JSON.parse(rawLegacyValue) as PlayerProgressRow);

    writeNativePlayerProgress(nativeDatabase, migratedProgress);
    LegacySQLiteStorage.removeItemSync(playerProgressStorageKey);

    return migratedProgress;
  } catch {
    return null;
  }
}

function writeNativePlayerProgress(nativeDatabase: SQLiteDatabase, progress: PlayerProgress) {
  nativeDatabase.runSync(
    `INSERT INTO player_progress (
      id,
      current_level_number,
      levels_completed,
      total_attempts,
      total_mistakes,
      perfect_clears
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      current_level_number = excluded.current_level_number,
      levels_completed = excluded.levels_completed,
      total_attempts = excluded.total_attempts,
      total_mistakes = excluded.total_mistakes,
      perfect_clears = excluded.perfect_clears;`,
    PLAYER_PROGRESS_ROW_ID,
    progress.currentLevelNumber,
    progress.levelsCompleted,
    progress.totalAttempts,
    progress.totalMistakes,
    progress.perfectClears,
  );
}
