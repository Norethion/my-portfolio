import { MessagesRepository } from "@/lib/repositories/messages.repository";
import type { Message, NewMessage } from "@/lib/db/schema";
import { BaseService } from "./base.service";

/**
 * Service for Messages business logic
 */
export class MessagesService extends BaseService {
    private repository: MessagesRepository;

    constructor() {
        super();
        this.repository = new MessagesRepository();
    }

    /**
     * Send (save) a new message
     */
    async sendMessage(data: NewMessage, ip?: string): Promise<Message> {
        this.log("sendMessage", { email: data.email, ip });

        if (ip) {
            const allowed = await this.repository.checkRateLimit(ip);
            if (!allowed) {
                throw new Error("Rate limit exceeded. Please try again later.");
            }
            data.ipAddress = ip;
        }

        return await this.repository.createMessage(data);
    }

    async getAllMessages(): Promise<Message[]> {
        this.log("getAllMessages");
        return await this.repository.getAllMessages();
    }

    async deleteMessage(id: number): Promise<void> {
        this.log("deleteMessage", { id });
        await this.repository.deleteMessage(id);
    }

    async markAsRead(id: number): Promise<void> {
        this.log("markAsRead", { id });
        await this.repository.markAsRead(id);
    }

    async getUnreadCount(): Promise<number> {
        return await this.repository.getUnreadCount();
    }
}
