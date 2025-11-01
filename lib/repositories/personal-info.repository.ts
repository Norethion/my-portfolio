import { db } from "@/lib/db/drizzle";
import { personalInfo } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { PersonalInfo, NewPersonalInfo } from "@/lib/db/schema";
import { BaseRepository } from "./base.repository";

/**
 * Repository for PersonalInfo data access
 * Handles all database operations for personal information
 */
export class PersonalInfoRepository extends BaseRepository {
  /**
   * Get the single personal info record
   * Since there's only one personal info, we get the first record
   */
  async getPersonalInfo(): Promise<PersonalInfo | null> {
    const result = await db.select().from(personalInfo).limit(1);
    return result[0] || null;
  }

  /**
   * Create a new personal info record
   */
  async createPersonalInfo(data: Partial<NewPersonalInfo>): Promise<PersonalInfo> {
    const result = await db
      .insert(personalInfo)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as NewPersonalInfo)
      .returning();
    
    return result[0];
  }

  /**
   * Update existing personal info record
   */
  async updatePersonalInfo(
    id: number,
    data: Partial<NewPersonalInfo>
  ): Promise<PersonalInfo> {
    const result = await db
      .update(personalInfo)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(personalInfo.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error(`PersonalInfo with id ${id} not found`);
    }

    return result[0];
  }

  /**
   * Upsert personal info (create or update)
   * Since there's only one personal info, this handles both cases
   */
  async upsertPersonalInfo(data: Partial<NewPersonalInfo>): Promise<PersonalInfo> {
    const existing = await this.getPersonalInfo();

    if (existing) {
      // Update existing
      return this.updatePersonalInfo(existing.id, data);
    } else {
      // Create new
      return this.createPersonalInfo(data);
    }
  }
}

