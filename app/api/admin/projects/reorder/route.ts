/**
 * Admin Projects Reorder API Route
 * Used by: ProjectsManager component (drag and drop reordering)
 * Purpose: Update project display order
 * PUT /api/admin/projects/reorder
 */
import { NextResponse } from "next/server";
import { ProjectsService } from "@/lib/services/projects.service";
import { handleApiError } from "@/lib/errors/error-handler";

import { verifyAdmin, unauthorizedResponse } from "@/lib/auth/admin-auth";

export async function PUT(request: Request) {
  try {
    if (!(await verifyAdmin(request))) return unauthorizedResponse();

    const body = await request.json();
    const service = new ProjectsService();
    await service.reorderProjects(body.items);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

