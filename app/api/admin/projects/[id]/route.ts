/**
 * Admin Single Project API Route
 * Used by: ProjectDialog component (edit/delete operations)
 * Purpose: Update or delete a specific project
 * PUT /api/admin/projects/[id] - Update project
 * DELETE /api/admin/projects/[id] - Delete project (only manual projects)
 */
import { NextResponse } from "next/server";
import { ProjectsService } from "@/lib/services/projects.service";
import { handleApiError } from "@/lib/errors/error-handler";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const service = new ProjectsService();
    const project = await service.updateProject(parseInt(id), body);
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = new ProjectsService();
    await service.deleteProject(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

