import { NextResponse } from "next/server";
import { MessagesService } from "@/lib/services/messages.service";
import { handleApiError } from "@/lib/errors/error-handler";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth/admin-auth";

export async function GET(request: Request) {
    try {
        if (!(await verifyAdmin(request))) return unauthorizedResponse();

        const service = new MessagesService();
        const count = await service.getUnreadCount();
        return NextResponse.json({ count });
    } catch (error) {
        return handleApiError(error);
    }
}
