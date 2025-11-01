import type { NewProject } from "@/lib/db/schema";
import { InternalServerError } from "@/lib/errors/api-error";
import { BaseService } from "./base.service";

/**
 * Interface for GitHub repository data
 */
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  private: boolean;
  fork: boolean;
}

/**
 * Service for GitHub API interactions
 * Handles fetching and parsing GitHub repository data
 */
export class GitHubService extends BaseService {
  /**
   * Fetch repositories from GitHub API
   */
  async fetchRepositories(): Promise<GitHubRepo[]> {
    this.log("fetchRepositories");

    const githubUsername = process.env.GITHUB_USERNAME;
    
    if (!githubUsername) {
      throw new InternalServerError("GITHUB_USERNAME environment variable is required");
    }

    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (!response.ok) {
      throw new InternalServerError(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json() as GitHubRepo[];
    
    // Filter only public, non-fork repositories
    return repos.filter((repo) => repo.private === false && !repo.fork);
  }

  /**
   * Convert GitHub repo to project data format
   */
  convertRepoToProject(repo: GitHubRepo): Omit<NewProject, "order"> {
    return {
      githubId: repo.id,
      name: repo.name,
      description: repo.description || null,
      url: repo.html_url,
      homepage: repo.homepage || null,
      language: repo.language || null,
      stars: repo.stargazers_count,
      topics: repo.topics || [],
      isManual: false,
      isVisible: true,
    };
  }
}

