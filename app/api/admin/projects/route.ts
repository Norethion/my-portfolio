/**
 * Admin Projects API Route
 * Used by: ProjectsManager component (admin dashboard)
 * Purpose: List all projects and create new manual projects
 * GET /api/admin/projects - List all projects
 * POST /api/admin/projects - Create new manual project
 */
import { NextResponse } from "next/server";
import { ProjectsService } from "@/lib/services/projects.service";
import { handleApiError } from "@/lib/errors/error-handler";

import { verifyAdmin, unauthorizedResponse } from "@/lib/auth/admin-auth";

export async function GET(request: Request) {
  try {
    if (!(await verifyAdmin(request))) return unauthorizedResponse();

    const service = new ProjectsService();
    const projects = await service.getAllProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAdmin(request))) return unauthorizedResponse();

    const body = await request.json();
    const service = new ProjectsService();
    const project = await service.createManualProject(body);
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return handleApiError(error);
  }
}

