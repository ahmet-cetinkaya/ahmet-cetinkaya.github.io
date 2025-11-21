import HomeDirectories from "./HomeDirectories";

export default class WallpaperPaths {
  static readonly CODE_SPACE_PICTURES = `${HomeDirectories.PICTURES}/code-space`;

  static readonly LAYER_1 = `${WallpaperPaths.CODE_SPACE_PICTURES}/code-space-layer-1.webp`;
  static readonly LAYER_1_MEDIUM = `${WallpaperPaths.CODE_SPACE_PICTURES}/code-space-layer-1-medium.webp`;
  static readonly LAYER_1_SMALL = `${WallpaperPaths.CODE_SPACE_PICTURES}/code-space-layer-1-small.webp`;

  static readonly LAYER_2 = `${WallpaperPaths.CODE_SPACE_PICTURES}/code-space-layer-2.webp`;
  static readonly LAYER_2_MEDIUM = `${WallpaperPaths.CODE_SPACE_PICTURES}/code-space-layer-2-medium.webp`;
  static readonly LAYER_2_SMALL = `${WallpaperPaths.CODE_SPACE_PICTURES}/code-space-layer-2-small.webp`;

  static getLayer1Paths() {
    return {
      large: WallpaperPaths.LAYER_1,
      medium: WallpaperPaths.LAYER_1_MEDIUM,
      small: WallpaperPaths.LAYER_1_SMALL,
    };
  }

  static getLayer2Paths() {
    return {
      large: WallpaperPaths.LAYER_2,
      medium: WallpaperPaths.LAYER_2_MEDIUM,
      small: WallpaperPaths.LAYER_2_SMALL,
    };
  }
}
