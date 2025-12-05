import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { messages, projects, visitorStats } from "@/lib/db/schema";
import { sql, eq, and } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        // Auth check is handled by middleware but good to be safe if moved
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 1. Unread Messages
        const unreadMessagesCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(messages)
            .where(eq(messages.isRead, false));

        // 2. Active Projects (Visible)
        const activeProjectsCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(projects)
            .where(eq(projects.isVisible, true));

        // 3. Total Visitors
        const totalVisitors = await db
            .select({ count: sql<number>`sum(${visitorStats.count})` })
            .from(visitorStats);

        // 4. Today Visitors
        const today = new Date().toISOString().split("T")[0];
        const todayVisitors = await db
            .select({ count: visitorStats.count })
            .from(visitorStats)
            .where(eq(visitorStats.date, today));

        return NextResponse.json({
            unreadMessages: Number(unreadMessagesCount[0]?.count ?? 0),
            activeProjects: Number(activeProjectsCount[0]?.count ?? 0),
            totalVisitors: Number(totalVisitors[0]?.count ?? 0),
            todayVisitors: Number(todayVisitors[0]?.count ?? 0),
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
