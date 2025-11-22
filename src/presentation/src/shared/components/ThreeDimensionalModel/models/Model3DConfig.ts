import type { ModelControlsConfig } from "./ModelControlsConfig";
import type { ModelAnimationConfig } from "./ModelAnimationConfig";

export interface Model3DConfig {
  controls?: ModelControlsConfig;
  animation?: ModelAnimationConfig;
  /**
   * Minimum horizontal scale (in world units) to ensure visibility on narrow screens.
   */
  minHorizontalScale?: number;
}
