import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Personal Info Table
export const personalInfo = pgTable("personal_info", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  jobTitle: varchar("job_title", { length: 255 }),
  bioTr: text("bio_tr"), // Turkish bio
  bioEn: text("bio_en"), // English bio
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  github: varchar("github", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  twitter: varchar("twitter", { length: 255 }),
  instagram: varchar("instagram", { length: 255 }),
  facebook: varchar("facebook", { length: 255 }),
  location: varchar("location", { length: 255 }),
  avatar: text("avatar"),
  languages: text("languages"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Projects Table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  githubId: integer("github_id").unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  customDescription: text("custom_description"),
  url: text("url").notNull(),
  homepage: text("homepage"),
  language: varchar("language", { length: 50 }),
  stars: integer("stars").default(0).notNull(),
  topics: text("topics").array().notNull().default(sql`ARRAY[]::text[]`),
  order: integer("order").notNull().default(0),
  isVisible: boolean("is_visible").default(true).notNull(),
  isManual: boolean("is_manual").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// CV Skills Category Enum
export const skillCategoryEnum = pgEnum("skill_category", [
  "Frontend",
  "Backend",
  "Mobile",
  "Desktop",
  "DevOps",
  "Database",
  "Tools",
  "Other",
]);

// CV Skills Level Enum
export const skillLevelEnum = pgEnum("skill_level", [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
]);

// CV Experiences Table
export const cvExperiences = pgTable("cv_experiences", {
  id: serial("id").primaryKey(),
  company: varchar("company", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  startDate: varchar("start_date", { length: 50 }).notNull(),
  endDate: varchar("end_date", { length: 50 }),
  current: boolean("current").default(false).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  employmentType: varchar("employment_type", { length: 50 }),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// CV Education Table
export const cvEducation = pgTable("cv_education", {
  id: serial("id").primaryKey(),
  school: varchar("school", { length: 255 }).notNull(),
  degree: varchar("degree", { length: 255 }).notNull(),
  field: varchar("field", { length: 255 }),
  startDate: varchar("start_date", { length: 50 }).notNull(),
  endDate: varchar("end_date", { length: 50 }),
  description: text("description"),
  grade: varchar("grade", { length: 50 }),
  activities: text("activities"),
  location: varchar("location", { length: 255 }),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// CV Skills Table
export const cvSkills = pgTable("cv_skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  level: varchar("level", { length: 50 }).notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Settings Table
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).unique().notNull(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports for use in components
export type PersonalInfo = typeof personalInfo.$inferSelect;
export type NewPersonalInfo = typeof personalInfo.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type CVExperience = typeof cvExperiences.$inferSelect;
export type NewCVExperience = typeof cvExperiences.$inferInsert;
export type CVEducation = typeof cvEducation.$inferSelect;
export type NewCVEducation = typeof cvEducation.$inferInsert;
export type CVSkill = typeof cvSkills.$inferSelect;
export type NewCVSkill = typeof cvSkills.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;

