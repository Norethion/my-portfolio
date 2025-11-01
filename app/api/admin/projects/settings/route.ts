/**
 * Admin Projects Settings API Route
 * Used by: ProjectsManager component (sync settings panel)
 * Purpose: Get and update GitHub sync cache duration
 * GET /api/admin/projects/settings - Get sync settings
 * PUT /api/admin/projects/settings - Update cache duration
 */
import { NextResponse } from "next/server";
import { SettingsService } from "@/lib/services/settings.service";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET() {
  try {
    const service = new SettingsService();
    
    const cacheDuration = await service.getOrCreateSetting("github_cache_duration", "3600000");
    const lastSync = await service.getOrCreateSetting("last_github_sync", new Date(0).toISOString());

    return NextResponse.json({
      cacheDuration: parseInt(cacheDuration.value),
      lastSync: lastSync.value,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const service = new SettingsService();
    await service.setSetting("github_cache_duration", body.cacheDuration.toString());
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

