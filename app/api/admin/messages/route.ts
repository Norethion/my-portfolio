/**
 * Admin Messages API Route
 * Used by: MessagesManager component
 * Purpose: Get, delete and mark messages as read
 * GET /api/admin/messages - List messages
 */
import { NextResponse } from "next/server";
import { MessagesService } from "@/lib/services/messages.service";
import { handleApiError } from "@/lib/errors/error-handler";

import { verifyAdmin, unauthorizedResponse } from "@/lib/auth/admin-auth";

export async function GET(request: Request) {
    try {
        if (!(await verifyAdmin(request))) return unauthorizedResponse();

        const service = new MessagesService();
        const messages = await service.getAllMessages();
        return NextResponse.json({ messages });
    } catch (error) {
        return handleApiError(error);
    }
}
