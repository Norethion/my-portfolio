/**
 * Admin Personal Info API Route
 * Used by: PersonalInfoEditor component (fetching and saving data)
 * Purpose: Get personal information without cache, and create/update personal information
 * GET /api/admin/personal-info - Get personal info (no cache)
 * PUT /api/admin/personal-info - Create or update personal information
 */
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { PersonalInfoService } from "@/lib/services/personal-info.service";
import { handleApiError } from "@/lib/errors/error-handler";

import { verifyAdmin, unauthorizedResponse } from "@/lib/auth/admin-auth";

/**
 * GET endpoint for admin - returns data without cache
 */
export async function GET(request: Request) {
  try {
    if (!(await verifyAdmin(request))) return unauthorizedResponse();

    const service = new PersonalInfoService();
    const info = await service.getAdminPersonalInfo();
    return NextResponse.json({ data: info });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT endpoint - create or update personal info
 */
export async function PUT(request: Request) {
  try {
    if (!(await verifyAdmin(request))) return unauthorizedResponse();

    const body = await request.json();
    const service = new PersonalInfoService();
    const result = await service.upsertPersonalInfo(body);

    // Revalidate cache after update
    revalidatePath("/");
    revalidatePath("/api/personal-info");

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return handleApiError(error);
  }
}

