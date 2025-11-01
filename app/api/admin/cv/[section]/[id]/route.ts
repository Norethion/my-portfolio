/**
 * Admin CV Item API Route
 * Used by: ExperienceDialog, EducationDialog, SkillDialog components
 * Purpose: Update or delete a specific CV item
 * PUT /api/admin/cv/[section]/[id] - Update item
 * DELETE /api/admin/cv/[section]/[id] - Delete item
 */
import { NextResponse } from "next/server";
import { CVService } from "@/lib/services/cv.service";
import { handleApiError, errorResponse } from "@/lib/errors/error-handler";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ section: string; id: string }> }
) {
  const { section, id } = await params;
  try {
    const body = await request.json();
    const service = new CVService();

    let result;
    if (section === "experiences") {
      result = await service.updateExperience(parseInt(id), body);
    } else if (section === "education") {
      result = await service.updateEducation(parseInt(id), body);
    } else if (section === "skills") {
      result = await service.updateSkill(parseInt(id), body);
    } else {
      return errorResponse("Invalid section", 400);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ section: string; id: string }> }
) {
  const { section, id } = await params;
  try {
    const service = new CVService();

    if (section === "experiences") {
      await service.deleteExperience(parseInt(id));
    } else if (section === "education") {
      await service.deleteEducation(parseInt(id));
    } else if (section === "skills") {
      await service.deleteSkill(parseInt(id));
    } else {
      return errorResponse("Invalid section", 400);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
