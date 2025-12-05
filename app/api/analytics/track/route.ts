import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { visitorStats } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function POST() {
    try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        await db
            .insert(visitorStats)
            .values({
                date: today,
                count: 1,
            })
            .onConflictDoUpdate({
                target: visitorStats.date,
                set: {
                    count: sql`${visitorStats.count} + 1`,
                },
            });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error tracking visitor:", error);
        return NextResponse.json(
            { error: "Failed to track visitor" },
            { status: 500 }
        );
    }
}
