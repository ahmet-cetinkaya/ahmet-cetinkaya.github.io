import HomeDirectories from "./HomeDirectories";
import Icons from "@domain/data/Icons";

export default class ThumbnailPaths {
  static readonly COMPUTER = `${HomeDirectories.MODELS}/computer/computer-thumbnail.webp`;
  static readonly ENVELOPE = `${HomeDirectories.MODELS}/envelope/envelope-thumbnail.webp`;
  static readonly TERMINAL = `${HomeDirectories.MODELS}/terminal/terminal-thumbnail.webp`;
  static readonly DOOM = `${HomeDirectories.MODELS}/doom/doom-thumbnail.webp`;

  static getThumbnailPath(icon: Icons): string {
    const thumbnailMap: Record<string, string> = {
      [Icons.computer]: ThumbnailPaths.COMPUTER,
      [Icons.envelope]: ThumbnailPaths.ENVELOPE,
      [Icons.terminal]: ThumbnailPaths.TERMINAL,
      [Icons.doom]: ThumbnailPaths.DOOM,
    };

    return thumbnailMap[icon] || "";
  }
}
