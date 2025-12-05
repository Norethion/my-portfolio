import { db } from "@/lib/db/drizzle";
import { messages } from "@/lib/db/schema";
import { eq, gt, and, count } from "drizzle-orm";
import type { Message, NewMessage } from "@/lib/db/schema";

import { BaseRepository } from "./base.repository";

/**
 * Repository for Messages data access
 */
export class MessagesRepository extends BaseRepository {
    /**
      * Check if IP has exceeded rate limit (5 messages per hour)
      */
    async checkRateLimit(ip: string): Promise<boolean> {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        const result = await db
            .select({ count: count() })
            .from(messages)
            .where(
                and(
                    eq(messages.ipAddress, ip),
                    gt(messages.createdAt, oneHourAgo)
                )
            );

        return result[0].count < 5;
    }

    async getUnreadCount(): Promise<number> {
        const result = await db
            .select({ count: count() })
            .from(messages)
            .where(eq(messages.isRead, false));
        return result[0].count;
    }

    /**
     * Create a new message
     */
    async createMessage(data: NewMessage): Promise<Message> {
        const result = await db.insert(messages).values(data).returning();
        return result[0];
    }

    async getAllMessages(): Promise<Message[]> {
        return await db.select().from(messages).orderBy(messages.createdAt);
    }

    async deleteMessage(id: number): Promise<void> {
        await db.delete(messages).where(eq(messages.id, id));
    }

    async markAsRead(id: number): Promise<void> {
        await db.update(messages).set({ isRead: true }).where(eq(messages.id, id));
    }
}
