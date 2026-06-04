import HomeDirectories from "./HomeDirectories";
import Icons from "@domain/data/Icons";

export default class ThumbnailPaths {
  static readonly COMPUTER = `${HomeDirectories.MODELS}/computer/computer-thumbnail.webp`;
  static readonly DOOM = `${HomeDirectories.MODELS}/doom/doom-thumbnail.webp`;
  static readonly ENVELOPE = `${HomeDirectories.MODELS}/envelope/envelope-thumbnail.webp`;
  static readonly FOLDER = `${HomeDirectories.MODELS}/folder/folder-thumbnail.webp`;
  static readonly TERMINAL = `${HomeDirectories.MODELS}/terminal/terminal-thumbnail.webp`;

  static getThumbnailPath(icon: Icons): string {
    const thumbnailMap: Record<string, string> = {
      [Icons.computer]: ThumbnailPaths.COMPUTER,
      [Icons.doom]: ThumbnailPaths.DOOM,
      [Icons.envelope]: ThumbnailPaths.ENVELOPE,
      [Icons.folder]: ThumbnailPaths.FOLDER,
      [Icons.terminal]: ThumbnailPaths.TERMINAL,
    };

    return thumbnailMap[icon] || "";
  }
}
