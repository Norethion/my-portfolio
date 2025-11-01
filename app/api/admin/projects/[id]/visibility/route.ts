import { NextRequest, NextResponse } from 'next/server';
import { readProjects, writeProjects } from '@/lib/utils/project-storage';
import { logInfo, logError } from '@/lib/utils/logger';

/**
 * PATCH /api/admin/projects/[id]/visibility
 * Updates the visibility of a project
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { is_visible } = body;

    if (typeof is_visible !== 'boolean') {
      return NextResponse.json(
        { error: 'is_visible must be a boolean' },
        { status: 400 }
      );
    }

    const projects = await readProjects();
    const projectIndex = projects.findIndex((p) => p.id === parseInt(id));

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    projects[projectIndex].is_visible = is_visible;
    await writeProjects(projects);

    logInfo(
      `Updated visibility for project ${id}`,
      'VisibilityAPI',
      { projectId: id, is_visible }
    );

    return NextResponse.json({
      success: true,
      project: projects[projectIndex],
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    logError('Failed to update visibility', 'VisibilityAPI', { error: errorMessage });

    return NextResponse.json(
      {
        error: 'Failed to update visibility',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
