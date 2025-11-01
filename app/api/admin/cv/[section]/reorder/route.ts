/**
 * Admin CV Section Reorder API Route
 * Used by: ExperiencesManager, EducationManager components (drag and drop)
 * Purpose: Update display order within a CV section
 * PUT /api/admin/cv/[section]/reorder
 */
import { NextResponse } from "next/server";
import { CVService } from "@/lib/services/cv.service";
import { handleApiError, errorResponse } from "@/lib/errors/error-handler";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  try {
    const body = await request.json();
    const service = new CVService();

    if (!Array.isArray(body.items)) {
      return errorResponse("Invalid request body", 400);
    }

    if (section === "experiences") {
      await service.reorderExperiences(body.items);
    } else if (section === "education") {
      await service.reorderEducation(body.items);
    } else if (section === "skills") {
      await service.reorderSkills(body.items);
    } else {
      return errorResponse("Invalid section", 400);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
