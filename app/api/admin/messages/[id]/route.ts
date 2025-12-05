/**
 * Admin Message Detail API Route
 * Used by: MessagesManager component
 * Purpose: Delete or update a single message
 * DELETE /api/admin/messages/[id] - Delete message
 * PUT /api/admin/messages/[id] - Mark as read
 */
import { NextResponse } from "next/server";
import { MessagesService } from "@/lib/services/messages.service";
import { handleApiError } from "@/lib/errors/error-handler";

import { verifyAdmin, unauthorizedResponse } from "@/lib/auth/admin-auth";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!(await verifyAdmin(request))) return unauthorizedResponse();

        const id = parseInt((await params).id);
        const service = new MessagesService();
        await service.deleteMessage(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!(await verifyAdmin(request))) return unauthorizedResponse();

        const id = parseInt((await params).id);
        const service = new MessagesService();
        await service.markAsRead(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return handleApiError(error);
    }
}
