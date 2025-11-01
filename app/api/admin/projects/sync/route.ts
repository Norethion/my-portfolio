import { NextRequest, NextResponse } from 'next/server';
import { shouldSyncGitHub } from '@/lib/utils/github-sync';
import { getCacheMetadata, saveCacheMetadata, readProjects, writeProjects, Project } from '@/lib/utils/project-storage';
import { logInfo, logWarn, logError } from '@/lib/utils/logger';

const DEFAULT_CACHE_DURATION = 15; // minutes

/**
 * POST /api/admin/projects/sync
 * Syncs projects from GitHub API with cache control
 * 
 * Query parameters:
 * - force: boolean - Bypass cache and sync immediately
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    // Get cache metadata
    const cacheMetadata = await getCacheMetadata();
    const cacheDuration = cacheMetadata?.duration || DEFAULT_CACHE_DURATION;
    const lastSync = cacheMetadata?.lastSync || null;

    // Check if sync is needed (unless forced)
    if (!force && !shouldSyncGitHub(lastSync, cacheDuration)) {
      const minutesRemaining = Math.ceil(
        (cacheDuration * 60 * 1000 - (Date.now() - (lastSync || 0))) / (60 * 1000)
      );

      logInfo(
        `Sync skipped due to cache. Next sync available in ${minutesRemaining} minutes.`,
        'GitHubSync',
        { lastSync, cacheDuration, minutesRemaining }
      );

      return NextResponse.json(
        {
          success: false,
          message: `Cache still valid. Next sync available in ${minutesRemaining} minutes.`,
          nextSyncIn: minutesRemaining,
          lastSync: lastSync ? new Date(lastSync).toISOString() : null,
        },
        { status: 200 }
      );
    }

    logInfo('Starting GitHub sync...', 'GitHubSync', { force, cacheDuration });

    // Fetch from GitHub API
    const githubUsername = process.env.GITHUB_USERNAME || 'aydemir-ali';
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      logError(
        `GitHub API error: ${response.status}`,
        'GitHubSync',
        { status: response.status, error: errorText }
      );
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    // Filter and map repositories
    const githubProjects = repos
      .filter((repo: any) => repo.private === false && !repo.fork)
      .map((repo: any, index: number) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || 'No description available',
        url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count || 0,
        topics: repo.topics || [],
        updated_at: repo.updated_at,
        created_at: repo.created_at,
        github_id: repo.id,
      }));

    // Read existing projects to preserve admin settings
    const existingProjects = await readProjects();
    const existingProjectsMap = new Map(
      existingProjects.map((p) => [p.github_id, p])
    );

    // Merge GitHub data with existing projects
    const mergedProjects: Project[] = githubProjects.map((githubProject: any) => {
      const existing = existingProjectsMap.get(githubProject.github_id);
      
      if (existing) {
        // Preserve admin settings
        return {
          ...githubProject,
          is_visible: existing.is_visible,
          order_index: existing.order_index,
          last_synced_at: Date.now(),
        };
      } else {
        // New project - default to visible, use GitHub order
        return {
          ...githubProject,
          is_visible: true,
          order_index: existingProjects.length + githubProjects.indexOf(githubProject),
          last_synced_at: Date.now(),
        };
      }
    });

    // Add any manually added projects that aren't from GitHub
    const manualProjects = existingProjects.filter(
      (p) => !p.github_id || !githubProjects.find((gp: any) => gp.github_id === p.github_id)
    );
    
    const allProjects = [...mergedProjects, ...manualProjects].sort(
      (a, b) => a.order_index - b.order_index
    );

    // Save projects
    await writeProjects(allProjects);

    // Update cache metadata
    const syncTimestamp = Date.now();
    await saveCacheMetadata(syncTimestamp, cacheDuration);

    logInfo(
      `GitHub sync completed successfully. Synced ${mergedProjects.length} projects.`,
      'GitHubSync',
      { projectCount: mergedProjects.length, syncTimestamp }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${mergedProjects.length} projects from GitHub.`,
      projectCount: mergedProjects.length,
      lastSync: new Date(syncTimestamp).toISOString(),
      nextSyncIn: cacheDuration,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    
    logError('GitHub sync failed', 'GitHubSync', { error: errorMessage });

    // Provide more detailed error information
    let errorDetails = errorMessage;
    if (errorMessage.includes('GitHub API error')) {
      errorDetails = 'GitHub API is unavailable or rate-limited. Please try again later.';
    } else if (errorMessage.includes('fetch')) {
      errorDetails = 'Network error occurred. Please check your connection.';
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync projects from GitHub',
        message: errorDetails,
        canRetry: !errorMessage.includes('rate'),
      },
      { status: 500 }
    );
  }
}
