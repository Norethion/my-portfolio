import { NextResponse } from "next/server";
import { SettingsService } from "@/lib/services/settings.service";
import { handleApiError } from "@/lib/errors/error-handler";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const service = new SettingsService();
        const passwordSetting = await service.getOrCreateSetting("admin_password", "");

        if (!passwordSetting.value) {
            return NextResponse.json({ error: "Admin password not configured" }, { status: 500 });
        }

        if (password === passwordSetting.value) {
            // In a real app we'd issue a JWT/Session here.
            // Since we kept the logic simple (Bearer <password>), we return the password (or a success) 
            // and the client stores it as the token.
            return NextResponse.json({ success: true, token: password });
        }

        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    } catch (error) {
        return handleApiError(error);
    }
}
