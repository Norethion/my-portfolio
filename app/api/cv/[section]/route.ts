/**
 * Public CV Section API Route
 * Used by: Currently not used (potential future use for partial CV data)
 * Purpose: Returns CV data for a specific section (experiences, education, skills)
 * GET /api/cv/[section]
 */
import { NextResponse } from "next/server";
import { CVService } from "@/lib/services/cv.service";
import { handleApiError, errorResponse } from "@/lib/errors/error-handler";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  try {
    const service = new CVService();

    let data;
    if (section === "experiences") {
      data = await service.getExperiences();
    } else if (section === "education") {
      data = await service.getEducation();
    } else if (section === "skills") {
      data = await service.getSkills();
    } else {
      return errorResponse("Invalid section", 400);
    }

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiError(error);
  }
}
