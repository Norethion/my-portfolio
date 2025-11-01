import { PersonalInfoRepository } from "@/lib/repositories/personal-info.repository";
import type { PersonalInfo, NewPersonalInfo } from "@/lib/db/schema";
import { ValidationError } from "@/lib/errors/api-error";
import { updatePersonalInfoSchema } from "@/lib/validators/personal-info.schema";
import { BaseService } from "./base.service";

/**
 * Service for PersonalInfo business logic
 * Handles validation, data transformation, and cache management
 */
export class PersonalInfoService extends BaseService {
  private repository: PersonalInfoRepository;

  constructor() {
    super();
    this.repository = new PersonalInfoRepository();
  }

  /**
   * Get personal info for admin (fresh data, no cache)
   */
  async getAdminPersonalInfo(): Promise<PersonalInfo | null> {
    this.log("getAdminPersonalInfo");
    return await this.repository.getPersonalInfo();
  }

  /**
   * Get personal info for public (can be cached)
   */
  async getPublicPersonalInfo(): Promise<PersonalInfo | null> {
    this.log("getPublicPersonalInfo");
    return await this.repository.getPersonalInfo();
  }

  /**
   * Create or update personal info
   * Handles data sanitization and validation
   */
  async upsertPersonalInfo(data: Partial<NewPersonalInfo>): Promise<PersonalInfo> {
    this.log("upsertPersonalInfo", { hasData: !!data });

    // Sanitize data - remove read-only fields that shouldn't be updated
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, createdAt: _createdAt, ...sanitizedData } = data;

    // Validate and transform data
    const validatedData = this.validatePersonalInfoData(sanitizedData);

    // Upsert to database
    return await this.repository.upsertPersonalInfo(validatedData);
  }

  /**
   * Get default/empty personal info structure
   * Used when no personal info exists yet
   */
  getDefaultPersonalInfo(): Partial<PersonalInfo> {
    return {
      name: "",
      jobTitle: "",
      bioTr: "",
      bioEn: "",
      email: "",
      phone: "",
      github: "",
      linkedin: "",
      twitter: "",
      instagram: "",
      facebook: "",
      location: "",
      avatar: "",
      languages: "",
    };
  }

  /**
   * Validate personal info data using Zod
   * @throws {ValidationError} if validation fails
   */
  private validatePersonalInfoData(
    data: Partial<NewPersonalInfo>
  ): Partial<NewPersonalInfo> {
    try {
      // Validate with Zod schema
      const validated = updatePersonalInfoSchema.parse(data);
      return validated;
    } catch (error) {
      throw new ValidationError(
        "Personal info validation failed",
        error
      );
    }
  }
}

