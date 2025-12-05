/**
 * Public Projects API Route
 * Used by: ProjectsPage component (public projects listing page)
 * Purpose: Get visible projects. Sync is now handled by Vercel Cron.
 * GET /api/projects
 */
import { NextResponse } from "next/server";
import { ProjectsService } from "@/lib/services/projects.service";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET() {
  try {
    const projectsService = new ProjectsService();
    
    // Get visible projects
    const projects = await projectsService.getVisibleProjects();

    return NextResponse.json({ projects });
  } catch (error) {
    return handleApiError(error);
  }
}
