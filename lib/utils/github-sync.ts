/**
 * Shared utility functions for GitHub sync operations
 * Provides cache checking and sync control logic
 */

interface CacheMetadata {
  lastSync: number; // timestamp
  duration: number; // cache duration in minutes
}

/**
 * Checks if GitHub sync should be performed based on cache duration
 * @param lastSyncTimestamp - Timestamp of last sync (milliseconds)
 * @param cacheDurationMinutes - Cache duration in minutes (default: 15)
 * @returns true if sync should be performed, false if cache is still valid
 */
export function shouldSyncGitHub(
  lastSyncTimestamp: number | null,
  cacheDurationMinutes: number = 15
): boolean {
  // If no previous sync exists, we should sync
  if (lastSyncTimestamp === null || lastSyncTimestamp === 0) {
    return true;
  }

  // Calculate time elapsed since last sync
  const now = Date.now();
  const elapsedMinutes = (now - lastSyncTimestamp) / (1000 * 60);

  // Sync if cache duration has expired
  return elapsedMinutes >= cacheDurationMinutes;
}

/**
 * Calculates the time until next sync is available (in minutes)
 * @param lastSyncTimestamp - Timestamp of last sync (milliseconds)
 * @param cacheDurationMinutes - Cache duration in minutes (default: 15)
 * @returns Number of minutes until next sync, or 0 if sync is available now
 */
export function getMinutesUntilNextSync(
  lastSyncTimestamp: number | null,
  cacheDurationMinutes: number = 15
): number {
  if (lastSyncTimestamp === null || lastSyncTimestamp === 0) {
    return 0; // Sync available immediately
  }

  const now = Date.now();
  const elapsedMinutes = (now - lastSyncTimestamp) / (1000 * 60);
  const remaining = cacheDurationMinutes - elapsedMinutes;

  return Math.max(0, Math.ceil(remaining));
}

// Note: Cache metadata functions are implemented in project-storage.ts
// This file focuses on sync logic, storage operations are handled separately
