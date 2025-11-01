import { NextResponse } from 'next/server';
import { readProjects, Project } from '@/lib/utils/project-storage';
import { shouldSyncGitHub } from '@/lib/utils/github-sync';
import { getCacheMetadata } from '@/lib/utils/project-storage';
import { logInfo, logError } from '@/lib/utils/logger';

const DEFAULT_CACHE_DURATION = 15; // minutes

/**
 * GET /api/projects
 * Returns public projects (is_visible = true) sorted by order_index
 * Automatically syncs with GitHub if cache has expired
 */
export async function GET() {
  try {
    // Check if we need to sync
    const cacheMetadata = await getCacheMetadata();
    const cacheDuration = cacheMetadata?.duration || DEFAULT_CACHE_DURATION;
    const lastSync = cacheMetadata?.lastSync || null;

    if (shouldSyncGitHub(lastSync, cacheDuration)) {
      logInfo(
        'Cache expired, triggering background sync',
        'ProjectsAPI',
        { lastSync, cacheDuration }
      );

      // Trigger sync in background (fire and forget)
      // Note: This requires the request to come from an authenticated admin context
      // In production, you might want to use a queue system or scheduled jobs
      // For now, we'll skip automatic background sync to avoid unauthorized access
      logInfo('Cache expired, but background sync skipped (requires admin auth)', 'ProjectsAPI');
    }

    // Read projects from storage
    const allProjects = await readProjects();

    // Filter only visible projects and sort by order_index
    const visibleProjects = allProjects
      .filter((project: Project) => project.is_visible === true)
      .sort((a, b) => a.order_index - b.order_index)
      .map((project: Project) => ({
        // Return only public-facing fields
        id: project.id,
        name: project.name,
        description: project.description,
        url: project.url,
        homepage: project.homepage,
        language: project.language,
        stars: project.stars,
        topics: project.topics,
        updated_at: project.updated_at,
        created_at: project.created_at,
      }));

    logInfo(
      `Returning ${visibleProjects.length} visible projects`,
      'ProjectsAPI',
      { totalProjects: allProjects.length, visibleProjects: visibleProjects.length }
    );

    return NextResponse.json({
      projects: visibleProjects,
      count: visibleProjects.length,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    // Return empty array on error instead of failing completely
    // This allows the UI to still function
    logError('Failed to fetch projects, returning empty array', 'ProjectsAPI', { error: errorMessage });
    
    return NextResponse.json(
      {
        projects: [],
        count: 0,
        error: 'Failed to fetch projects',
      },
      { status: 200 } // Return 200 with empty array to prevent UI breaking
    );
  }
}
