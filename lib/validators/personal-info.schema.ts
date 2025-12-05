import { z } from "zod";

/**
 * Validation schema for PersonalInfo
 * Used for validating personal information data
 */
export const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),

  jobTitle: z
    .string()
    .max(255, "Job title too long")
    .optional()
    .nullable(),

  bioTr: z
    .string()
    .max(2000, "Turkish bio too long")
    .optional()
    .nullable(),

  bioEn: z
    .string()
    .max(2000, "English bio too long")
    .optional()
    .nullable(),

  email: z
    .string()
    .email("Invalid email format")
    .max(255, "Email too long")
    .optional()
    .nullable()
    .or(z.literal("")),

  phone: z
    .string()
    .max(50, "Phone too long")
    .optional()
    .nullable(),

  github: z
    .string()
    .url("Invalid GitHub URL")
    .max(255, "GitHub URL too long")
    .optional()
    .nullable()
    .or(z.literal("")),

  linkedin: z
    .string()
    .url("Invalid LinkedIn URL")
    .max(255, "LinkedIn URL too long")
    .optional()
    .nullable()
    .or(z.literal("")),

  twitter: z
    .string()
    .url("Invalid Twitter URL")
    .max(255, "Twitter URL too long")
    .optional()
    .nullable()
    .or(z.literal("")),

  instagram: z
    .string()
    .url("Invalid Instagram URL")
    .max(255, "Instagram URL too long")
    .optional()
    .nullable()
    .or(z.literal("")),

  facebook: z
    .string()
    .url("Invalid Facebook URL")
    .max(255, "Facebook URL too long")
    .optional()
    .nullable()
    .or(z.literal("")),

  location: z
    .string()
    .max(255, "Location too long")
    .optional()
    .nullable(),

  avatar: z
    .string()
    .max(50000000, "Avatar data too large") // ~37MB base64 for 25MB file
    .optional()
    .nullable(),

  languages: z
    .string()
    .max(500, "Languages too long")
    .optional()
    .nullable(),
});

/**
 * Schema for creating new personal info
 */
export const createPersonalInfoSchema = personalInfoSchema;

/**
 * Schema for updating personal info (all fields optional)
 */
export const updatePersonalInfoSchema = personalInfoSchema.partial().extend({
  name: z.string().min(1).max(255).optional(),
});

/**
 * Type inference from schema
 */
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type CreatePersonalInfoInput = z.infer<typeof createPersonalInfoSchema>;
export type UpdatePersonalInfoInput = z.infer<typeof updatePersonalInfoSchema>;

