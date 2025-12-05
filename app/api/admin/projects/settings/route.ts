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

import { verifyAdmin, unauthorizedResponse } from "@/lib/auth/admin-auth";

export async function GET(request: Request) {
  try {
    if (!(await verifyAdmin(request))) return unauthorizedResponse();

    const service = new SettingsService();

    // Only return lastSync, cache logic is deprecated
    const lastSync = await service.getOrCreateSetting("last_github_sync", new Date(0).toISOString());

    return NextResponse.json({
      lastSync: lastSync.value,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  // Settings update is disabled as we moved to Cron
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

