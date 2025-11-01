import { z } from "zod";

/**
 * Skill categories enum
 */
export const skillCategoryEnum = z.enum([
  "Frontend",
  "Backend",
  "Mobile",
  "Desktop",
  "DevOps",
  "Database",
  "Tools",
  "Other",
]);

/**
 * Skill levels enum
 */
export const skillLevelEnum = z.enum([
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
]);

/**
 * Validation schema for CV Experience
 */
export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required").max(255, "Company name too long"),
  
  position: z.string().min(1, "Position is required").max(255, "Position too long"),
  
  startDate: z.string().min(1, "Start date is required").max(50, "Start date too long"),
  
  endDate: z
    .string()
    .max(50, "End date too long")
    .optional()
    .nullable(),
  
  current: z.boolean().default(false),
  
  description: z
    .string()
    .max(5000, "Description too long")
    .optional()
    .nullable(),
  
  location: z
    .string()
    .max(255, "Location too long")
    .optional()
    .nullable(),
  
  employmentType: z
    .string()
    .max(50, "Employment type too long")
    .optional()
    .nullable(),
  
  order: z.number().int().min(0).default(0),
});

/**
 * Schema for creating experience
 */
export const createExperienceSchema = experienceSchema;

/**
 * Schema for updating experience
 */
export const updateExperienceSchema = experienceSchema.partial().extend({
  company: z.string().min(1).max(255).optional(),
  position: z.string().min(1).max(255).optional(),
  startDate: z.string().min(1).max(50).optional(),
});

/**
 * Validation schema for CV Education
 */
export const educationSchema = z.object({
  school: z.string().min(1, "School is required").max(255, "School name too long"),
  
  degree: z.string().min(1, "Degree is required").max(255, "Degree too long"),
  
  field: z
    .string()
    .max(255, "Field too long")
    .optional()
    .nullable(),
  
  startDate: z.string().min(1, "Start date is required").max(50, "Start date too long"),
  
  endDate: z
    .string()
    .max(50, "End date too long")
    .optional()
    .nullable(),
  
  description: z
    .string()
    .max(5000, "Description too long")
    .optional()
    .nullable(),
  
  grade: z
    .string()
    .max(50, "Grade too long")
    .optional()
    .nullable(),
  
  activities: z
    .string()
    .max(2000, "Activities too long")
    .optional()
    .nullable(),
  
  location: z
    .string()
    .max(255, "Location too long")
    .optional()
    .nullable(),
  
  order: z.number().int().min(0).default(0),
});

/**
 * Schema for creating education
 */
export const createEducationSchema = educationSchema;

/**
 * Schema for updating education
 */
export const updateEducationSchema = educationSchema.partial().extend({
  school: z.string().min(1).max(255).optional(),
  degree: z.string().min(1).max(255).optional(),
  startDate: z.string().min(1).max(50).optional(),
});

/**
 * Validation schema for CV Skill
 */
export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(255, "Skill name too long"),
  
  category: skillCategoryEnum,
  
  level: skillLevelEnum,
  
  order: z.number().int().min(0).default(0),
});

/**
 * Schema for creating skill
 */
export const createSkillSchema = skillSchema;

/**
 * Schema for updating skill
 */
export const updateSkillSchema = skillSchema.partial().extend({
  name: z.string().min(1).max(255).optional(),
  category: skillCategoryEnum.optional(),
  level: skillLevelEnum.optional(),
});

/**
 * Schema for reordering CV sections
 */
export const reorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.number().int().positive(),
        order: z.number().int().min(0),
      })
    )
    .min(1, "At least one item required"),
});

/**
 * Type inference from schemas
 */
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;

export type EducationInput = z.infer<typeof educationSchema>;
export type CreateEducationInput = z.infer<typeof createEducationSchema>;
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>;

export type SkillInput = z.infer<typeof skillSchema>;
export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;

export type ReorderInput = z.infer<typeof reorderSchema>;

