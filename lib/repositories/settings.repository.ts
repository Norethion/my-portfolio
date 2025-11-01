import { db } from "@/lib/db/drizzle";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Setting } from "@/lib/db/schema";
import { BaseRepository } from "./base.repository";

/**
 * Repository for Settings data access
 * Handles all database operations for application settings
 */
export class SettingsRepository extends BaseRepository {
  /**
   * Get a setting by key
   */
  async getSetting(key: string): Promise<Setting | null> {
    const result = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Get multiple settings by keys
   */
  async getSettings(keys: string[]): Promise<Setting[]> {
    if (keys.length === 0) return [];
    
    // Using OR conditions for multiple keys
    const result = await db
      .select()
      .from(settings);
    
    return result.filter(s => keys.includes(s.key));
  }

  /**
   * Get or create a setting (return existing or create with default value)
   */
  async getOrCreateSetting(key: string, defaultValue: string): Promise<Setting> {
    const existing = await this.getSetting(key);
    
    if (existing) {
      return existing;
    }

    // Create new setting
    const result = await db
      .insert(settings)
      .values({
        key,
        value: defaultValue,
        updatedAt: new Date(),
      })
      .returning();
    
    return result[0];
  }

  /**
   * Set a setting value (upsert)
   */
  async setSetting(key: string, value: string): Promise<Setting> {
    const existing = await this.getSetting(key);

    if (existing) {
      // Update existing
      const result = await db
        .update(settings)
        .set({
          value,
          updatedAt: new Date(),
        })
        .where(eq(settings.key, key))
        .returning();
      
      return result[0];
    } else {
      // Create new
      const result = await db
        .insert(settings)
        .values({
          key,
          value,
          updatedAt: new Date(),
        })
        .returning();
      
      return result[0];
    }
  }

  /**
   * Delete a setting
   */
  async deleteSetting(key: string): Promise<void> {
    await db.delete(settings).where(eq(settings.key, key));
  }

  /**
   * Get all settings
   */
  async getAllSettings(): Promise<Setting[]> {
    return await db.select().from(settings);
  }
}

