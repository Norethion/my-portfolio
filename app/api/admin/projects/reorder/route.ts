import { NextRequest, NextResponse } from 'next/server';
import { readProjects, writeProjects } from '@/lib/utils/project-storage';
import { logInfo, logError } from '@/lib/utils/logger';

/**
 * PATCH /api/admin/projects/reorder
 * Updates the order of projects
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { projects: reorderData } = body;

    if (!Array.isArray(reorderData)) {
      return NextResponse.json(
        { error: 'projects must be an array' },
        { status: 400 }
      );
    }

    const projects = await readProjects();
    const projectMap = new Map(projects.map((p) => [p.id, p]));

    // Update order_index for each project
    for (const item of reorderData) {
      const project = projectMap.get(item.id);
      if (project) {
        project.order_index = item.order_index;
      }
    }

    // Save updated projects
    await writeProjects(projects);

    logInfo(
      `Updated order for ${reorderData.length} projects`,
      'ReorderAPI',
      { projectCount: reorderData.length }
    );

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    logError('Failed to reorder projects', 'ReorderAPI', { error: errorMessage });

    return NextResponse.json(
      {
        error: 'Failed to reorder projects',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
