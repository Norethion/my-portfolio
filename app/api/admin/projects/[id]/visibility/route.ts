/**
 * Admin Project Visibility API Route
 * Used by: ProjectsManager component (toggle visibility button)
 * Purpose: Show/hide a project from public view
 * PUT /api/admin/projects/[id]/visibility
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
    const project = await service.toggleVisibility(parseInt(id), body.isVisible);
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return handleApiError(error);
  }
}

