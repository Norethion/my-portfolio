import { ProjectsRepository } from "@/lib/repositories/projects.repository";
import { GitHubService } from "./github.service";
import type { Project, NewProject } from "@/lib/db/schema";
import { InternalServerError } from "@/lib/errors/api-error";
import { BaseService } from "./base.service";

/**
 * Service for Projects business logic
 * Handles project management, GitHub sync logic, and visibility control
 */
export class ProjectsService extends BaseService {
  private repository: ProjectsRepository;
  private githubService: GitHubService;

  constructor() {
    super();
    this.repository = new ProjectsRepository();
    this.githubService = new GitHubService();
  }

  /**
   * Get all projects (admin)
   */
  async getAllProjects(): Promise<Project[]> {
    this.log("getAllProjects");
    return await this.repository.getAllProjects();
  }

  /**
   * Get visible projects only (public)
   */
  async getVisibleProjects(): Promise<Project[]> {
    this.log("getVisibleProjects");
    return await this.repository.getVisibleProjects();
  }

  /**
   * Get single project by ID
   */
  async getProjectById(id: number): Promise<Project | null> {
    this.log("getProjectById", { id });
    return await this.repository.getProjectById(id);
  }

  /**
   * Create a new manual project
   */
  async createManualProject(data: Omit<NewProject, "isManual">): Promise<Project> {
    this.log("createManualProject", { name: data.name });

    // Get next order value
    const nextOrder = await this.repository.getMaxOrder();

    // Ensure it's marked as manual
    const projectData: NewProject = {
      ...data,
      isManual: true,
      order: nextOrder,
    };

    return await this.repository.createProject(projectData);
  }

  /**
   * Update an existing project
   */
  async updateProject(
    id: number,
    data: Partial<NewProject>
  ): Promise<Project> {
    this.log("updateProject", { id });
    return await this.repository.updateProject(id, data);
  }

  /**
   * Delete a project (only manual projects)
   */
  async deleteProject(id: number): Promise<void> {
    this.log("deleteProject", { id });

    const project = await this.repository.getProjectById(id);

    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }

    if (!project.isManual) {
      throw new Error("Cannot delete GitHub projects");
    }

    await this.repository.deleteProject(id);
  }

  /**
   * Reorder projects
   */
  async reorderProjects(items: Array<{ id: number; order: number }>): Promise<void> {
    this.log("reorderProjects", { count: items.length });
    await this.repository.reorderProjects(items);
  }

  /**
   * Toggle project visibility
   */
  async toggleVisibility(id: number, isVisible: boolean): Promise<Project> {
    this.log("toggleVisibility", { id, isVisible });
    return await this.repository.toggleVisibility(id, isVisible);
  }

  /**
   * Sync GitHub projects
   * Fetches from GitHub API and updates database
   */
  async syncGitHubProjects(): Promise<{ synced: number }> {
    this.log("syncGitHubProjects");

    try {
      // Fetch from GitHub using GitHubService
      const repos = await this.githubService.fetchRepositories();
      
      // Get existing GitHub projects
      const existingProjects = await this.repository.getGitHubProjects();

      // Convert GitHub repos to project data (without order, will be added by repository)
      const projectsData = repos.map(repo => 
        this.githubService.convertRepoToProject(repo)
      );

      // Update existing and add new
      await this.repository.upsertGitHubProjects(projectsData);

      // Hide projects that are no longer in GitHub
      for (const existing of existingProjects) {
        if (
          existing.githubId &&
          !repos.find((r) => r.id === existing.githubId)
        ) {
          await this.repository.toggleVisibility(existing.id, false);
        }
      }

      return { synced: repos.length };
    } catch (error) {
      if (error instanceof InternalServerError) {
        throw error;
      }
      throw new InternalServerError(
        "Failed to sync GitHub projects",
        error
      );
    }
  }
}

