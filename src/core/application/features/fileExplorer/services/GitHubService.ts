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

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
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
   * Fetch the last commit date for a specific file path
   */
  async getLastModifiedDate(repoName: string, filePath: string): Promise<Date | null> {
    try {
      const cleanPath = filePath.startsWith("/") ? filePath.substring(1) : filePath;
      const response = await fetch(
        `${this.baseUrl}/repos/${this.username}/${repoName}/commits?path=${encodeURIComponent(cleanPath)}&per_page=1`,
      );

      if (!response.ok) {
        return null;
      }

      const commits = (await response.json()) as GitHubCommit[];
      if (!commits || commits.length === 0) {
        return null;
      }

      const lastCommit = commits[0];
      return new Date(lastCommit.commit.committer.date);
    } catch (error) {
      logger.error(`Failed to fetch last modified date for ${repoName}/${filePath}:`, error);
      return null;
    }
  }

  /**
   * Fetch raw content of a file
   */
  async getFileContent(repoName: string, path: string): Promise<string> {
    try {
      const cleanPath = path.startsWith("/") ? path.substring(1) : path;

      // Try to get content metadata first to get the download_url

      try {
        const content = await this.getContents(repoName, path);
        if (!Array.isArray(content) && content.download_url) {
          const fileResponse = await fetch(content.download_url);
          if (!fileResponse.ok) throw new Error("Failed to download file");
          return await fileResponse.text();
        }
      } catch (error) {
        logger.debug(`getFileContent: Primary fetch failed, falling back to raw.githubusercontent.com`, error);
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
