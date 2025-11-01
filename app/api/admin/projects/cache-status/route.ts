import { NextResponse } from 'next/server';
import { getCacheMetadata } from '@/lib/utils/project-storage';
import { getMinutesUntilNextSync } from '@/lib/utils/github-sync';
import { logError } from '@/lib/utils/logger';

const DEFAULT_CACHE_DURATION = 15; // minutes

/**
 * GET /api/admin/projects/cache-status
 * Returns cache status information for sync operations
 */
export async function GET() {
  try {
    const cacheMetadata = await getCacheMetadata();
    const cacheDuration = cacheMetadata?.duration || DEFAULT_CACHE_DURATION;
    const lastSync = cacheMetadata?.lastSync || null;

    const minutesUntilNext = getMinutesUntilNextSync(lastSync, cacheDuration);

    return NextResponse.json({
      lastSync,
      duration: cacheDuration,
      minutesUntilNext,
      canSync: minutesUntilNext === 0,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    logError('Failed to get cache status', 'CacheStatusAPI', { error: errorMessage });

    return NextResponse.json(
      {
        error: 'Failed to get cache status',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
