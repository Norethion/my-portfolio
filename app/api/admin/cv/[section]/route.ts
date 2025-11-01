/**
 * Admin CV Section API Route
 * Used by: ExperiencesManager, EducationManager, SkillsManager components
 * Purpose: List and create CV items for a specific section (experiences, education, skills)
 * GET /api/admin/cv/[section] - List all items in section
 * POST /api/admin/cv/[section] - Create new item in section
 */
import { NextResponse } from "next/server";
import { CVService } from "@/lib/services/cv.service";
import { handleApiError, errorResponse } from "@/lib/errors/error-handler";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    const service = new CVService();

    let result;
    if (section === "experiences") {
      result = await service.getExperiences();
    } else if (section === "education") {
      result = await service.getEducation();
    } else if (section === "skills") {
      result = await service.getSkills();
    } else {
      return errorResponse("Invalid section", 400);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    const body = await request.json();
    const service = new CVService();

    let result;
    if (section === "experiences") {
      result = await service.createExperience(body);
    } else if (section === "education") {
      result = await service.createEducation(body);
    } else if (section === "skills") {
      result = await service.createSkill(body);
    } else {
      return errorResponse("Invalid section", 400);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return handleApiError(error);
  }
}

