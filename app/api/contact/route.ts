/**
 * Contact API Route
 * Used by: ContactPage component
 * Purpose: Submit contact form messages
 * POST /api/contact
 */
import { NextResponse } from "next/server";
import { MessagesService } from "@/lib/services/messages.service";
import { handleApiError } from "@/lib/errors/error-handler";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.name || !body.email || !body.subject || !body.message) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const ip = request.headers.get("x-forwarded-for")?.split(',')[0] || "unknown"; // Get first IP if multiple

        const service = new MessagesService();
        const result = await service.sendMessage(body, ip);

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return handleApiError(error);
    }
}
