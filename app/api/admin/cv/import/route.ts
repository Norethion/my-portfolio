/**
 * Admin CV LinkedIn Import API Route
 * Used by: LinkedInImportDialog component
 * Purpose: Import experiences, education, and skills from LinkedIn export
 * POST /api/admin/cv/import
 */
import { NextResponse } from "next/server";
import { CVService } from "@/lib/services/cv.service";
import { handleApiError, errorResponse } from "@/lib/errors/error-handler";
import {
  parseLinkedInJSON,
  validateLinkedInJSON,
  parseLinkedInCSV,
  validateLinkedInCSV,
} from "@/lib/utils/linkedin-parser";

import { verifyAdmin, unauthorizedResponse } from "@/lib/auth/admin-auth";

export async function POST(request: Request) {
  try {
    if (!(await verifyAdmin(request))) return unauthorizedResponse();

    const body = await request.json();
    const { jsonData, isCSV } = body;

    if (!jsonData) {
      return errorResponse("No data provided", 400);
    }

    let parsedData;

    // Handle CSV or JSON format
    if (isCSV) {
      // Validate LinkedIn CSV
      const validation = validateLinkedInCSV(jsonData);
      if (!validation.valid) {
        return errorResponse(
          validation.error || "Invalid LinkedIn CSV export file",
          400
        );
      }

      // Parse LinkedIn CSV
      parsedData = parseLinkedInCSV(jsonData);
    } else {
      // Validate LinkedIn JSON
      const validation = validateLinkedInJSON(jsonData);
      if (!validation.valid) {
        return errorResponse(
          validation.error || "Invalid LinkedIn export file",
          400
        );
      }

      // Parse LinkedIn JSON
      parsedData = parseLinkedInJSON(jsonData);
    }

    // Import using CVService
    const service = new CVService();
    await service.bulkImportCVData(parsedData);

    return NextResponse.json({
      success: true,
      message: "LinkedIn data imported successfully",
      imported: {
        experiences: parsedData.experiences.length,
        education: parsedData.education.length,
        skills: parsedData.skills.length,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
