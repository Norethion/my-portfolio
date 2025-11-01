import { z } from "zod";

/**
 * Validation schema for Project
 */
export const projectSchema = z.object({
  githubId: z.number().int().positive().optional().nullable(),
  
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  
  description: z
    .string()
    .max(5000, "Description too long")
    .optional()
    .nullable(),
  
  customDescription: z
    .string()
    .max(5000, "Custom description too long")
    .optional()
    .nullable(),
  
  url: z.string().url("Invalid URL").max(2048, "URL too long"),
  
  homepage: z
    .string()
    .url("Invalid homepage URL")
    .max(2048, "Homepage URL too long")
    .optional()
    .nullable()
    .or(z.literal("")),
  
  language: z
    .string()
    .max(50, "Language too long")
    .optional()
    .nullable(),
  
  stars: z.number().int().min(0).default(0),
  
  topics: z.array(z.string()).default([]),
  
  order: z.number().int().min(0).default(0),
  
  isVisible: z.boolean().default(true),
  
  isManual: z.boolean().default(false),
});

/**
 * Schema for creating new project
 */
export const createProjectSchema = projectSchema.omit({
  githubId: true, // githubId is auto-assigned
});

/**
 * Schema for creating manual project (admin)
 */
export const createManualProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().max(5000).optional().nullable(),
  url: z.string().url("Invalid URL").max(2048),
  homepage: z.string().url("Invalid URL").max(2048).optional().nullable().or(z.literal("")),
  language: z.string().max(50).optional().nullable(),
  stars: z.number().int().min(0).default(0),
  topics: z.array(z.string()).default([]),
  isVisible: z.boolean().default(true),
});

/**
 * Schema for updating project
 */
export const updateProjectSchema = createManualProjectSchema.partial().extend({
  isVisible: z.boolean().optional(),
});

/**
 * Schema for reordering projects
 */
export const reorderProjectsSchema = z.object({
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
 * Type inference from schema
 */
export type ProjectInput = z.infer<typeof projectSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateManualProjectInput = z.infer<typeof createManualProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ReorderProjectsInput = z.infer<typeof reorderProjectsSchema>;

