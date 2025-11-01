import { NextResponse } from "next/server";
import { CVService } from "@/lib/services/cv.service";
import { PersonalInfoService } from "@/lib/services/personal-info.service";
import { handleApiError } from "@/lib/errors/error-handler";

/**
 * Public CV API Route
 * Used by: CVPage component (public CV page)
 * Purpose: Returns all CV data (experiences, education, skills, personal info)
 * GET /api/cv
 */
export async function GET() {
  try {
    const cvService = new CVService();
    const personalInfoService = new PersonalInfoService();

    const [experiences, education, skills, personalInfoData] = await Promise.all([
      cvService.getExperiences(),
      cvService.getEducation(),
      cvService.getSkills(),
      personalInfoService.getPublicPersonalInfo(),
    ]);

    return NextResponse.json({
      experiences,
      education,
      skills,
      personalInfo: personalInfoData || null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
