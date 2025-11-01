/**
 * Admin Projects Sync API Route
 * Used by: ProjectsManager component (sync button) and /api/projects (auto-triggered)
 * Purpose: Sync GitHub repositories to database
 * POST /api/admin/projects/sync
 */
import { NextResponse } from "next/server";
import { ProjectsService } from "@/lib/services/projects.service";
import { SettingsService } from "@/lib/services/settings.service";
import { handleApiError } from "@/lib/errors/error-handler";

export async function POST() {
  try {
    const projectsService = new ProjectsService();
    const settingsService = new SettingsService();
    
    // Sync GitHub projects
    const result = await projectsService.syncGitHubProjects();

    // Update sync timestamp
    await settingsService.setSetting("last_github_sync", new Date().toISOString());

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return handleApiError(error);
  }
}

