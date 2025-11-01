import { NextResponse } from 'next/server';
import { readProjects } from '@/lib/utils/project-storage';
import { logInfo, logError } from '@/lib/utils/logger';

/**
 * GET /api/admin/projects
 * Returns all projects (including hidden ones) for admin use
 */
export async function GET() {
  try {
    const projects = await readProjects();
    
    // Sort by order_index
    const sortedProjects = projects.sort((a, b) => a.order_index - b.order_index);

    logInfo(`Returning ${sortedProjects.length} projects for admin`, 'AdminProjectsAPI');

    return NextResponse.json({
      projects: sortedProjects,
      count: sortedProjects.length,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    // Return empty array instead of error to prevent UI breaking
    logError('Failed to fetch projects for admin, returning empty array', 'AdminProjectsAPI', { error: errorMessage });

    return NextResponse.json(
      {
        projects: [],
        count: 0,
        error: 'Failed to fetch projects',
      },
      { status: 200 }
    );
  }
}
