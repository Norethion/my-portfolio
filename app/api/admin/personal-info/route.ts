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

/**
 * GET endpoint for admin - returns data without cache
 */
export async function GET() {
  try {
    const service = new PersonalInfoService();
    const info = await service.getAdminPersonalInfo();

    // Return default empty data if no info exists
    const defaultData = info || service.getDefaultPersonalInfo();
    
    return NextResponse.json(defaultData);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT endpoint - create or update personal info
 */
export async function PUT(request: Request) {
  try {
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

