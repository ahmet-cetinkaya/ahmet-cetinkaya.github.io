import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import { Apps } from "@domain/data/Apps";
import { TranslationKeys, type TranslationKey } from "@domain/data/Translations";
import File from "@domain/models/File";
import Window from "@domain/models/Window";
import CryptoExtensions from "@packages/acore-ts/crypto/CryptoExtensions";
import { logger } from "@shared/utils/logger";

export interface GameExecutable {
  fileName: string;
  appId: Apps;
  displayName: string;
  translationKey: TranslationKey;
  supportedExtensions: string[];
  icon?: string;
}

/**
 * Factory function to create a validated GameExecutable
 */
export function createGameExecutable(
  fileName: string,
  appId: Apps,
  displayName: string,
  translationKey: TranslationKey,
  supportedExtensions: string[],
  icon?: string,
): GameExecutable {
  if (!fileName || fileName.trim() === "") {
    throw new Error("GameExecutable fileName is required");
  }
  if (!Apps[appId]) {
    throw new Error(`Invalid appId: ${appId}`);
  }
  if (!supportedExtensions || supportedExtensions.length === 0) {
    throw new Error("At least one supported extension is required");
  }

  return {
    fileName: fileName.trim(),
    appId,
    displayName: displayName.trim(),
    translationKey,
    supportedExtensions: supportedExtensions.map((ext) => ext.toLowerCase()),
    icon,
  };
}

export interface GameLaunchOptions {
  maximized?: boolean;
  fullPath?: string;
}

export default class GameExecutionService {
  private readonly gameExecutables: Map<string, GameExecutable> = new Map();

  constructor(private readonly windowsService: IWindowsService) {
    this.initializeGameMappings();
  }

  private initializeGameMappings() {
    this.gameExecutables.set("doom.jsdos", {
      fileName: "doom.jsdos",
      appId: Apps.doom,
      displayName: "DOOM",
      translationKey: TranslationKeys.apps_doom,
      supportedExtensions: [".jsdos"],
    });
  }

  public isGameExecutable(entry: FileSystemEntry): boolean {
    if (!(entry instanceof File)) {
      return false;
    }

    const fileName = entry.name.toLowerCase();
    const fileExtension = this.getFileExtension(fileName);

    for (const game of this.gameExecutables.values()) {
      if (game.fileName.toLowerCase() === fileName || game.supportedExtensions.includes(fileExtension)) {
        return true;
      }
    }

    return false;
  }

  public getGameExecutable(entry: FileSystemEntry): GameExecutable | null {
    if (!(entry instanceof File)) {
      return null;
    }

    const fileName = entry.name.toLowerCase();
    const fileExtension = this.getFileExtension(fileName);

    for (const game of this.gameExecutables.values()) {
      if (game.fileName.toLowerCase() === fileName || game.supportedExtensions.includes(fileExtension)) {
        return game;
      }
    }

    return null;
  }

  public getSupportedGameExtensions(): string[] {
    const extensions = new Set<string>();
    for (const game of this.gameExecutables.values()) {
      game.supportedExtensions.forEach((ext) => extensions.add(ext));
    }
    return Array.from(extensions);
  }

  public async launchGame(entry: FileSystemEntry, options: GameLaunchOptions = {}): Promise<void> {
    if (!(entry instanceof File)) {
      throw new Error("Only files can be launched as games");
    }

    const gameExecutable = this.getGameExecutable(entry);
    if (!gameExecutable) {
      throw new Error(`Unsupported game executable: ${entry.name}`);
    }

    try {
      const appWindow = new Window(
        CryptoExtensions.generateNanoId(),
        gameExecutable.appId,
        gameExecutable.translationKey,
        undefined,
        undefined,
        options.maximized,
        undefined,
        undefined,
        undefined,
        options.fullPath ? [options.fullPath] : [entry.fullPath],
      );

      await this.windowsService.add(appWindow);

      // Force focus away from the file explorer to ensure proper window activation
      if (typeof document !== "undefined" && document.activeElement) {
        (document.activeElement as HTMLElement).blur();
      }

      try {
        await this.windowsService.active(appWindow);
      } catch (activationError) {
        // Window already being active is not an error - game launched successfully
        const errorMessage = activationError instanceof Error ? activationError.message : String(activationError);
        if (errorMessage.includes("already activated") || errorMessage.includes("already active")) {
          logger.info(`Game ${gameExecutable.displayName} launched successfully (window was already active)`);
          return; // Silently succeed for "already active" cases
        }
        // Re-throw real activation errors
        throw activationError;
      }
    } catch (error) {
      logger.error("Game launch error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Only show error dialog for real errors, not activation-related messages
      if (errorMessage.includes("already activated") || errorMessage.includes("already active")) {
        return; // Silently succeed for "already active" cases
      }
      throw new Error(`Failed to launch game ${gameExecutable.displayName}: ${errorMessage}`);
    }
  }

  /**
   * Get all game executables mapped to their file names
   */
  public getAllGameExecutables(): GameExecutable[] {
    return Array.from(this.gameExecutables.values());
  }

  /**
   * Check if a path points to the Games directory
   */
  public isGamesDirectory(path: string): boolean {
    const normalizedPath = path.toLowerCase();
    const pathWithoutTrailingSlash = normalizedPath.replace(/\/$/, "");
    return (
      pathWithoutTrailingSlash.endsWith("/games") ||
      pathWithoutTrailingSlash === "games" ||
      pathWithoutTrailingSlash.match(/^\/games$/) !== null
    );
  }

  /**
   * Get game launch command for terminal usage
   */
  public getGameLaunchCommand(entry: FileSystemEntry): string | null {
    const gameExecutable = this.getGameExecutable(entry);
    if (!gameExecutable) {
      return null;
    }

    // Map to terminal commands (e.g., doom, quake, etc.)
    switch (gameExecutable.appId) {
      case Apps.doom:
        return "doom";
      default:
        return null;
    }
  }

  /**
   * Extract file extension from filename
   */
  private getFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex === -1) {
      return "";
    }
    return fileName.substring(lastDotIndex).toLowerCase();
  }

  /**
   * Add new game executable mapping
   */
  public addGameExecutable(gameExecutable: GameExecutable): void {
    this.gameExecutables.set(gameExecutable.fileName.toLowerCase(), gameExecutable);
  }

  /**
   * Remove game executable mapping
   */
  public removeGameExecutable(fileName: string): boolean {
    const key = fileName.toLowerCase();
    return this.gameExecutables.delete(key);
  }

  /**
   * Get game by app ID
   */
  public getGameByAppId(appId: Apps): GameExecutable | null {
    for (const game of this.gameExecutables.values()) {
      if (game.appId === appId) {
        return game;
      }
    }
    return null;
  }
}
