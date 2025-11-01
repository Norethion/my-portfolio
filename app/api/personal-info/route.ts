/**
 * Public Personal Info API Route
 * Used by: HomeClient component (SSR), public pages
 * Purpose: Get personal information with 1 hour cache
 * GET /api/personal-info
 */
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { PersonalInfoService } from "@/lib/services/personal-info.service";
import { handleApiError } from "@/lib/errors/error-handler";

// Cache personal info for 1 hour (3600 seconds)
const getCachedPersonalInfo = unstable_cache(
  async () => {
    const service = new PersonalInfoService();
    return await service.getPublicPersonalInfo();
  },
  ["personal-info"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["personal-info"], // Tag for manual revalidation if needed
  }
);

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const info = await getCachedPersonalInfo();

      // Return default empty data if no info exists
    const service = new PersonalInfoService();
    const defaultData = info || service.getDefaultPersonalInfo();

    return NextResponse.json(defaultData);
  } catch (error) {
    return handleApiError(error);
  }
}

