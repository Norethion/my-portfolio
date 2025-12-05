
import { NextResponse } from "next/server";
import { SettingsService } from "@/lib/services/settings.service";

export async function verifyAdmin(request: Request): Promise<boolean> {
    // Allow GET requests if needed, but for Admin API usually we want auth everywhere except maybe public read
    // For this portfolio, GET /api/admin/* should be protected too unless specified otherwise
    // Wait, user said "admin password to DB", implies protection. 

    // NOTE: Cron jobs might fail if they don't have the token.
    // Cron jobs usually bypass auth or use a different secret. 
    // For now we assume standard Bearer auth.

    const authHeader = request.headers.get("authorization");

    if (!authHeader) return false;

    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) return false;

    const token = match[1];

    const settingsService = new SettingsService();
    const passwordSetting = await settingsService.getOrCreateSetting("admin_password", "");

    // Strict check: if no password in DB, nobody can login (secure by default)
    if (!passwordSetting.value) return false;

    return token === passwordSetting.value;
}

export function unauthorizedResponse() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
