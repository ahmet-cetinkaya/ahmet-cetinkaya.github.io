import type { Model3DConfig } from "../models";

export const DefaultConfigs = {
  full: {
    controls: {
      enableRotate: true,
      enableZoom: true,
      enablePan: false,
      enableDamping: true,
      dampingFactor: 0.25,
      autoRotateSpeed: 2,
      maxPolarAngle: Math.PI / 2,
      minZoom: 0.4,
      maxZoom: 5,
    },
    animation: {
      enableAutoRotate: true,
      autoRotateSpeed: 2,
      enableInitialAnimation: true,
      initialAnimationDuration: 100,
      initializationDelay: 0,
    },
  } as Model3DConfig,

  /** Configuration for desktop icons (animated but no interaction) */
  desktopIcon: {
    controls: {
      enableRotate: false,
      enableZoom: false,
      enablePan: false,
      enableDamping: false,
    },
    animation: {
      enableAutoRotate: true,
      autoRotateSpeed: 4,
      enableInitialAnimation: false,
      initialAnimationDuration: 0,
      initializationDelay: 1500,
    },
  } as Model3DConfig,

  /** Configuration for static display (no animation, no interaction) */
  static: {
    controls: {
      enableRotate: false,
      enableZoom: false,
      enablePan: false,
      enableDamping: false,
    },
    animation: {
      enableAutoRotate: false,
      enableInitialAnimation: false,
      initializationDelay: 0,
    },
  } as Model3DConfig,
};
