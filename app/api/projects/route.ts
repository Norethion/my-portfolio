/**
 * Public Projects API Route
 * Used by: ProjectsPage component (public projects listing page)
 * Purpose: Get visible projects, auto-trigger GitHub sync if cache expired
 * GET /api/projects
 */
import { NextResponse } from "next/server";
import { ProjectsService } from "@/lib/services/projects.service";
import { SettingsService } from "@/lib/services/settings.service";
import { handleApiError } from "@/lib/errors/error-handler";

async function shouldSyncGitHub(settingsService: SettingsService): Promise<boolean> {
  try {
    const cacheDurationSetting = await settingsService.getOrCreateSetting("github_cache_duration", "3600000");
    const lastSyncSetting = await settingsService.getOrCreateSetting("last_github_sync", new Date(0).toISOString());

    const cacheDuration = parseInt(cacheDurationSetting.value) || 3600000; // Default 1 hour
    const lastSync = new Date(lastSyncSetting.value).getTime();
    const now = Date.now();

    return now - lastSync > cacheDuration;
  } catch (error) {
    console.error("Error checking cache:", error);
    return false;
  }
}

async function triggerSync() {
  try {
    const syncUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/admin/projects/sync`;
    
    // Fire and forget sync
    fetch(syncUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_KEY}`,
      },
    }).catch((error) => {
      console.error("Background sync error:", error);
    });
  } catch (error) {
    console.error("Error triggering sync:", error);
  }
}

export async function GET() {
  try {
    const projectsService = new ProjectsService();
    const settingsService = new SettingsService();
    
    // Check if we should sync
    if (await shouldSyncGitHub(settingsService)) {
      triggerSync();
    }

    // Get visible projects
    const projects = await projectsService.getVisibleProjects();

    return NextResponse.json({ projects });
  } catch (error) {
    return handleApiError(error);
  }
}

