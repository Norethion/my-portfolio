import { SettingsRepository } from "@/lib/repositories/settings.repository";
import type { Setting } from "@/lib/db/schema";
import { BaseService } from "./base.service";

/**
 * Service for Settings business logic
 * Handles application settings management
 */
export class SettingsService extends BaseService {
  private repository: SettingsRepository;

  constructor() {
    super();
    this.repository = new SettingsRepository();
  }

  /**
   * Get a setting by key
   */
  async getSetting(key: string): Promise<Setting | null> {
    this.log("getSetting", { key });
    return await this.repository.getSetting(key);
  }

  /**
   * Get multiple settings
   */
  async getSettings(keys: string[]): Promise<Setting[]> {
    this.log("getSettings", { keys });
    return await this.repository.getSettings(keys);
  }

  /**
   * Get or create a setting
   */
  async getOrCreateSetting(key: string, defaultValue: string): Promise<Setting> {
    this.log("getOrCreateSetting", { key });
    return await this.repository.getOrCreateSetting(key, defaultValue);
  }

  /**
   * Set a setting value
   */
  async setSetting(key: string, value: string): Promise<Setting> {
    this.log("setSetting", { key });
    return await this.repository.setSetting(key, value);
  }

  /**
   * Delete a setting
   */
  async deleteSetting(key: string): Promise<void> {
    this.log("deleteSetting", { key });
    await this.repository.deleteSetting(key);
  }

  /**
   * Get all settings
   */
  async getAllSettings(): Promise<Setting[]> {
    this.log("getAllSettings");
    return await this.repository.getAllSettings();
  }
}

