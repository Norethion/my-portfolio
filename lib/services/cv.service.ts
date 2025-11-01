import { CVRepository } from "@/lib/repositories/cv.repository";
import type {
  CVExperience,
  NewCVExperience,
  CVEducation,
  NewCVEducation,
  CVSkill,
  NewCVSkill,
} from "@/lib/db/schema";
import { BaseService } from "./base.service";

/**
 * Service for CV business logic
 * Handles CV data management, LinkedIn import, and skill categorization
 */
export class CVService extends BaseService {
  private repository: CVRepository;

  constructor() {
    super();
    this.repository = new CVRepository();
  }

  // ==========================================
  // EXPERIENCES
  // ==========================================

  async getExperiences(): Promise<CVExperience[]> {
    this.log("getExperiences");
    return await this.repository.getExperiences();
  }

  async getExperienceById(id: number): Promise<CVExperience | null> {
    this.log("getExperienceById", { id });
    return await this.repository.getExperienceById(id);
  }

  async createExperience(data: NewCVExperience): Promise<CVExperience> {
    this.log("createExperience", { company: data.company });
    return await this.repository.createExperience(data);
  }

  async updateExperience(
    id: number,
    data: Partial<NewCVExperience>
  ): Promise<CVExperience> {
    this.log("updateExperience", { id });
    return await this.repository.updateExperience(id, data);
  }

  async deleteExperience(id: number): Promise<void> {
    this.log("deleteExperience", { id });
    await this.repository.deleteExperience(id);
  }

  async reorderExperiences(items: Array<{ id: number; order: number }>): Promise<void> {
    this.log("reorderExperiences", { count: items.length });
    await this.repository.reorderExperiences(items);
  }

  // ==========================================
  // EDUCATION
  // ==========================================

  async getEducation(): Promise<CVEducation[]> {
    this.log("getEducation");
    return await this.repository.getEducation();
  }

  async getEducationById(id: number): Promise<CVEducation | null> {
    this.log("getEducationById", { id });
    return await this.repository.getEducationById(id);
  }

  async createEducation(data: NewCVEducation): Promise<CVEducation> {
    this.log("createEducation", { school: data.school });
    return await this.repository.createEducation(data);
  }

  async updateEducation(
    id: number,
    data: Partial<NewCVEducation>
  ): Promise<CVEducation> {
    this.log("updateEducation", { id });
    return await this.repository.updateEducation(id, data);
  }

  async deleteEducation(id: number): Promise<void> {
    this.log("deleteEducation", { id });
    await this.repository.deleteEducation(id);
  }

  async reorderEducation(items: Array<{ id: number; order: number }>): Promise<void> {
    this.log("reorderEducation", { count: items.length });
    await this.repository.reorderEducation(items);
  }

  // ==========================================
  // SKILLS
  // ==========================================

  async getSkills(): Promise<CVSkill[]> {
    this.log("getSkills");
    return await this.repository.getSkills();
  }

  async getSkillById(id: number): Promise<CVSkill | null> {
    this.log("getSkillById", { id });
    return await this.repository.getSkillById(id);
  }

  async createSkill(data: NewCVSkill): Promise<CVSkill> {
    this.log("createSkill", { name: data.name });
    return await this.repository.createSkill(data);
  }

  async updateSkill(id: number, data: Partial<NewCVSkill>): Promise<CVSkill> {
    this.log("updateSkill", { id });
    return await this.repository.updateSkill(id, data);
  }

  async deleteSkill(id: number): Promise<void> {
    this.log("deleteSkill", { id });
    await this.repository.deleteSkill(id);
  }

  async reorderSkills(items: Array<{ id: number; order: number }>): Promise<void> {
    this.log("reorderSkills", { count: items.length });
    await this.repository.reorderSkills(items);
  }

  // ==========================================
  // BULK IMPORT
  // ==========================================

  async bulkImportCVData(data: {
    experiences?: Omit<NewCVExperience, "order">[];
    education?: Omit<NewCVEducation, "order">[];
    skills?: Omit<NewCVSkill, "order">[];
  }): Promise<void> {
    this.log("bulkImportCVData", {
      experiences: data.experiences?.length || 0,
      education: data.education?.length || 0,
      skills: data.skills?.length || 0,
    });
    
    await this.repository.bulkImportCVData(data);
  }
}

