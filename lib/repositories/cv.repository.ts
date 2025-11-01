import { db } from "@/lib/db/drizzle";
import { cvExperiences, cvEducation, cvSkills } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type {
  CVExperience,
  NewCVExperience,
  CVEducation,
  NewCVEducation,
  CVSkill,
  NewCVSkill,
} from "@/lib/db/schema";
import { BaseRepository } from "./base.repository";

/**
 * Repository for CV data access
 * Handles all database operations for CV sections (experiences, education, skills)
 */
export class CVRepository extends BaseRepository {
  // ==========================================
  // EXPERIENCES
  // ==========================================

  /**
   * Get all experiences
   */
  async getExperiences(): Promise<CVExperience[]> {
    return await db.select().from(cvExperiences).orderBy(cvExperiences.order);
  }

  /**
   * Get single experience by ID
   */
  async getExperienceById(id: number): Promise<CVExperience | null> {
    const result = await db
      .select()
      .from(cvExperiences)
      .where(eq(cvExperiences.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Create experience
   */
  async createExperience(data: Omit<NewCVExperience, "order">): Promise<CVExperience> {
    // Get max order
    const maxOrderResult = await db
      .select()
      .from(cvExperiences)
      .orderBy(cvExperiences.order)
      .limit(1);
    
    const nextOrder = maxOrderResult.length > 0 ? maxOrderResult[0].order + 1 : 0;
    
    const result = await db.insert(cvExperiences).values({
      ...data,
      order: nextOrder,
    } as NewCVExperience).returning();
    return result[0];
  }

  /**
   * Update experience
   */
  async updateExperience(id: number, data: Partial<NewCVExperience>): Promise<CVExperience> {
    const result = await db
      .update(cvExperiences)
      .set(data)
      .where(eq(cvExperiences.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error(`CVExperience with id ${id} not found`);
    }

    return result[0];
  }

  /**
   * Delete experience
   */
  async deleteExperience(id: number): Promise<void> {
    await db.delete(cvExperiences).where(eq(cvExperiences.id, id));
  }

  /**
   * Reorder experiences
   */
  async reorderExperiences(items: Array<{ id: number; order: number }>): Promise<void> {
    await db.transaction(async (tx) => {
      for (const item of items) {
        await tx
          .update(cvExperiences)
          .set({ order: item.order })
          .where(eq(cvExperiences.id, item.id));
      }
    });
  }

  // ==========================================
  // EDUCATION
  // ==========================================

  /**
   * Get all education entries
   */
  async getEducation(): Promise<CVEducation[]> {
    return await db.select().from(cvEducation).orderBy(cvEducation.order);
  }

  /**
   * Get single education by ID
   */
  async getEducationById(id: number): Promise<CVEducation | null> {
    const result = await db
      .select()
      .from(cvEducation)
      .where(eq(cvEducation.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Create education
   */
  async createEducation(data: Omit<NewCVEducation, "order">): Promise<CVEducation> {
    // Get max order
    const maxOrderResult = await db
      .select()
      .from(cvEducation)
      .orderBy(cvEducation.order)
      .limit(1);
    
    const nextOrder = maxOrderResult.length > 0 ? maxOrderResult[0].order + 1 : 0;
    
    const result = await db.insert(cvEducation).values({
      ...data,
      order: nextOrder,
    } as NewCVEducation).returning();
    return result[0];
  }

  /**
   * Update education
   */
  async updateEducation(id: number, data: Partial<NewCVEducation>): Promise<CVEducation> {
    const result = await db
      .update(cvEducation)
      .set(data)
      .where(eq(cvEducation.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error(`CVEducation with id ${id} not found`);
    }

    return result[0];
  }

  /**
   * Delete education
   */
  async deleteEducation(id: number): Promise<void> {
    await db.delete(cvEducation).where(eq(cvEducation.id, id));
  }

  /**
   * Reorder education
   */
  async reorderEducation(items: Array<{ id: number; order: number }>): Promise<void> {
    await db.transaction(async (tx) => {
      for (const item of items) {
        await tx
          .update(cvEducation)
          .set({ order: item.order })
          .where(eq(cvEducation.id, item.id));
      }
    });
  }

  // ==========================================
  // SKILLS
  // ==========================================

  /**
   * Get all skills
   */
  async getSkills(): Promise<CVSkill[]> {
    return await db.select().from(cvSkills).orderBy(cvSkills.order);
  }

  /**
   * Get single skill by ID
   */
  async getSkillById(id: number): Promise<CVSkill | null> {
    const result = await db
      .select()
      .from(cvSkills)
      .where(eq(cvSkills.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Create skill
   */
  async createSkill(data: Omit<NewCVSkill, "order">): Promise<CVSkill> {
    // Get max order
    const maxOrderResult = await db
      .select()
      .from(cvSkills)
      .orderBy(cvSkills.order)
      .limit(1);
    
    const nextOrder = maxOrderResult.length > 0 ? maxOrderResult[0].order + 1 : 0;
    
    const result = await db.insert(cvSkills).values({
      ...data,
      order: nextOrder,
    } as NewCVSkill).returning();
    return result[0];
  }

  /**
   * Update skill
   */
  async updateSkill(id: number, data: Partial<NewCVSkill>): Promise<CVSkill> {
    const result = await db
      .update(cvSkills)
      .set(data)
      .where(eq(cvSkills.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error(`CVSkill with id ${id} not found`);
    }

    return result[0];
  }

  /**
   * Delete skill
   */
  async deleteSkill(id: number): Promise<void> {
    await db.delete(cvSkills).where(eq(cvSkills.id, id));
  }

  /**
   * Reorder skills
   */
  async reorderSkills(items: Array<{ id: number; order: number }>): Promise<void> {
    await db.transaction(async (tx) => {
      for (const item of items) {
        await tx
          .update(cvSkills)
          .set({ order: item.order })
          .where(eq(cvSkills.id, item.id));
      }
    });
  }

  /**
   * Bulk import CV data (for LinkedIn imports)
   */
  async bulkImportCVData(data: {
    experiences?: Omit<NewCVExperience, "order">[];
    education?: Omit<NewCVEducation, "order">[];
    skills?: Omit<NewCVSkill, "order">[];
  }): Promise<void> {
    await db.transaction(async (tx) => {
      if (data.experiences) {
        const maxOrderResult = await tx
          .select()
          .from(cvExperiences)
          .orderBy(cvExperiences.order)
          .limit(1);
        let nextOrder = maxOrderResult.length > 0 ? maxOrderResult[0].order + 1 : 0;
        
        for (const exp of data.experiences) {
          await tx.insert(cvExperiences).values({ ...exp, order: nextOrder++ } as NewCVExperience);
        }
      }

      if (data.education) {
        const maxOrderResult = await tx
          .select()
          .from(cvEducation)
          .orderBy(cvEducation.order)
          .limit(1);
        let nextOrder = maxOrderResult.length > 0 ? maxOrderResult[0].order + 1 : 0;
        
        for (const edu of data.education) {
          await tx.insert(cvEducation).values({ ...edu, order: nextOrder++ } as NewCVEducation);
        }
      }

      if (data.skills) {
        const maxOrderResult = await tx
          .select()
          .from(cvSkills)
          .orderBy(cvSkills.order)
          .limit(1);
        let nextOrder = maxOrderResult.length > 0 ? maxOrderResult[0].order + 1 : 0;
        
        for (const skill of data.skills) {
          await tx.insert(cvSkills).values({ ...skill, order: nextOrder++ } as NewCVSkill);
        }
      }
    });
  }
}

