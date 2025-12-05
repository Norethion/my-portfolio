import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyAdmin, unauthorizedResponse } from "@/lib/auth/admin-auth";
import { handleApiError } from "@/lib/errors/error-handler";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
    try {
        if (!(await verifyAdmin(request))) return unauthorizedResponse();

        const allSettings = await db.select().from(settings);
        // Convert array of key-value pairs to an object
        const settingsMap = allSettings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        return NextResponse.json({
            github_username: settingsMap["github_username"] || "",
        });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(request: Request) {
    try {
        if (!(await verifyAdmin(request))) return unauthorizedResponse();

        const body = await request.json();
        const { github_username, admin_password } = body;

        if (github_username) {
            // Check if exists
            const existing = await db.select().from(settings).where(eq(settings.key, "github_username"));
            if (existing.length > 0) {
                await db.update(settings).set({ value: github_username }).where(eq(settings.key, "github_username"));
            } else {
                await db.insert(settings).values({ key: "github_username", value: github_username });
            }
        }

        if (admin_password) {
            const hashedPassword = await bcrypt.hash(admin_password, 10);
            const existing = await db.select().from(settings).where(eq(settings.key, "admin_password"));
            if (existing.length > 0) {
                await db.update(settings).set({ value: hashedPassword }).where(eq(settings.key, "admin_password"));
            } else {
                await db.insert(settings).values({ key: "admin_password", value: hashedPassword });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleApiError(error);
    }
}
