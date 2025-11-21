import type { ModelControlsConfig } from "./ModelControlsConfig";
import type { ModelAnimationConfig } from "./ModelAnimationConfig";

export interface Model3DConfig {
  controls?: ModelControlsConfig;
  animation?: ModelAnimationConfig;
}
