import { db } from "@/lib/db/drizzle";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Project, NewProject } from "@/lib/db/schema";
import { BaseRepository } from "./base.repository";

/**
 * Repository for Projects data access
 * Handles all database operations for projects
 */
export class ProjectsRepository extends BaseRepository {
  /**
   * Get all projects
   */
  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(projects.order);
  }

  /**
   * Get visible projects only
   */
  async getVisibleProjects(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.isVisible, true))
      .orderBy(projects.order);
  }

  /**
   * Get single project by ID
   */
  async getProjectById(id: number): Promise<Project | null> {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Get project by GitHub ID
   */
  async getProjectByGitHubId(githubId: number): Promise<Project | null> {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.githubId, githubId))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Create a new project
   */
  async createProject(data: NewProject): Promise<Project> {
    const result = await db.insert(projects).values(data).returning();
    return result[0];
  }

  /**
   * Update existing project
   */
  async updateProject(id: number, data: Partial<NewProject>): Promise<Project> {
    const result = await db
      .update(projects)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error(`Project with id ${id} not found`);
    }

    return result[0];
  }

  /**
   * Delete a project
   */
  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  /**
   * Update multiple project orders (for reordering)
   */
  async reorderProjects(items: Array<{ id: number; order: number }>): Promise<void> {
    // Use transaction to update all at once
    await db.transaction(async (tx) => {
      for (const item of items) {
        await tx
          .update(projects)
          .set({ order: item.order })
          .where(eq(projects.id, item.id));
      }
    });
  }

  /**
   * Toggle project visibility
   */
  async toggleVisibility(id: number, isVisible: boolean): Promise<Project> {
    const result = await db
      .update(projects)
      .set({ isVisible, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error(`Project with id ${id} not found`);
    }

    return result[0];
  }

  /**
   * Get all GitHub projects (non-manual)
   */
  async getGitHubProjects(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.isManual, false));
  }

  /**
   * Get maximum order value
   */
  async getMaxOrder(): Promise<number> {
    const result = await db
      .select()
      .from(projects)
      .orderBy(projects.order)
      .limit(1);

    return result.length > 0 ? result[0].order + 1 : 0;
  }

  /**
   * Bulk upsert projects (for GitHub sync)
   */
  async upsertGitHubProjects(projectsData: Array<Omit<Partial<NewProject>, "order">>): Promise<void> {
    await db.transaction(async (tx) => {
      for (const projectData of projectsData) {
        const existing = projectData.githubId
          ? await tx
            .select()
            .from(projects)
            .where(eq(projects.githubId, projectData.githubId))
            .limit(1)
          : [];

        if (existing.length > 0) {
          // Preserve exising visibility and custom description
          const { isVisible, customDescription, ...updateData } = projectData;

          await tx
            .update(projects)
            .set({
              ...updateData,
              updatedAt: new Date(),
            })
            .where(eq(projects.id, existing[0].id));
        } else {
          // Get next order for new projects
          const maxOrderResult = await tx
            .select()
            .from(projects)
            .orderBy(projects.order)
            .limit(1);

          const nextOrder = maxOrderResult.length > 0 ? maxOrderResult[0].order + 1 : 0;

          await tx.insert(projects).values({
            ...projectData,
            order: nextOrder,
            isVisible: true,
          } as NewProject);
        }
      }
    });
  }
}

