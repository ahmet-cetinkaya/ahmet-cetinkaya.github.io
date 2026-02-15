import { logger } from "@shared/utils/logger";

export interface GitHubRepository {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  default_branch: string;
  updated_at: string;
}

export interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: "file" | "dir";
  content?: string;
  encoding?: string;
}

export default class GitHubService {
  private readonly baseUrl = "https://api.github.com";
  private readonly username = "ahmet-cetinkaya";

  /**
   * Fetch all public repositories for the user
   */
  async getRepositories(): Promise<GitHubRepository[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${this.username}/repos?sort=updated&per_page=100`);

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error("Failed to fetch GitHub repositories:", error);
      return [];
    }
  }

  /**
   * Fetch contents of a path in a repository
   */
  async getContents(repoName: string, path: string = ""): Promise<GitHubContent[] | GitHubContent> {
    try {
      // Remove leading slash if present
      const cleanPath = path.startsWith("/") ? path.substring(1) : path;
      const url = `${this.baseUrl}/repos/${this.username}/${repoName}/contents/${cleanPath}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error(`Failed to fetch GitHub contents for ${repoName}/${path}:`, error);
      throw error;
    }
  }

  /**
   * Fetch raw content of a file
   */
  async getFileContent(repoName: string, path: string): Promise<string> {
    try {
      const cleanPath = path.startsWith("/") ? path.substring(1) : path;

      // Try master first, but we might need to check default branch if it fails
      // For simplicity in this MVP, we'll try to get the default branch from the repo info if possible,
      // but for now let's try to fetch the content metadata first to get the download_url

      try {
        const content = await this.getContents(repoName, path);
        if (!Array.isArray(content) && content.download_url) {
          const fileResponse = await fetch(content.download_url);
          if (!fileResponse.ok) throw new Error("Failed to download file");
          return await fileResponse.text();
        }
      } catch {
        // If getContents fails, it might be a rate limit or other issue.
        // Fallback to raw.githubusercontent.com if we can guess the branch (usually master or main)
      }

      // Fallback attempts
      const branches = ["main", "master"];
      for (const branch of branches) {
        const rawUrl = `https://raw.githubusercontent.com/${this.username}/${repoName}/${branch}/${cleanPath}`;
        const response = await fetch(rawUrl);
        if (response.ok) {
          return await response.text();
        }
      }

      throw new Error("Could not fetch file content");
    } catch (error) {
      logger.error(`Failed to fetch file content for ${repoName}/${path}:`, error);
      throw error;
    }
  }
}
