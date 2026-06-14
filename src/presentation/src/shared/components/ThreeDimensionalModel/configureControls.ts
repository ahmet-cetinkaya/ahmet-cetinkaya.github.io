import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Model3DConfig } from "./models";

/**
 * Apply control and animation configurations to OrbitControls
 */
export function configureControls(controls: OrbitControls, config: Model3DConfig): void {
  const controlsConfig = config.controls || {};
  const animationConfig = config.animation || {};

  controls.enableRotate = controlsConfig.enableRotate ?? true;
  controls.enableZoom = controlsConfig.enableZoom ?? true;
  controls.enablePan = controlsConfig.enablePan ?? false;
  controls.enableDamping = controlsConfig.enableDamping ?? true;
  controls.dampingFactor = controlsConfig.dampingFactor ?? 0.25;
  controls.maxPolarAngle = controlsConfig.maxPolarAngle ?? Math.PI / 2;
  controls.minZoom = controlsConfig.minZoom ?? 0.4;
  controls.maxZoom = controlsConfig.maxZoom ?? 5;

  controls.autoRotate = animationConfig.enableAutoRotate ?? false;
  controls.autoRotateSpeed = animationConfig.autoRotateSpeed ?? 2;
}
