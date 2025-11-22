import { Scene, AmbientLight, DirectionalLight } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TranslationKeys } from "@domain/data/Translations";
import LoadingModelPreview from "./Loading3DModelPreview";
import ThreeDimensionModelViewer from "@packages/acore-solidjs/ui/components/ThreeDimensionModelViewer";
import { DRACO_DIRECTORY } from "./constants/draco";
import ModelPaths from "@shared/constants/ModelPaths";
import type { Model3DConfig } from "./models";
import { DefaultConfigs } from "./constants/defaultConfigs";
import ThumbnailPaths from "@shared/constants/ThumbnailPaths";

type Props = {
  class?: string;
  config?: Model3DConfig;
};

const MODEL = ModelPaths.ENVELOPE;

export default function Envelope3DModel(props: Props) {
  const config = props.config || DefaultConfigs.full;

  function configureScene(scene: Scene) {
    // Lights
    const ambientLight = new AmbientLight("#fff", 1);
    scene.add(ambientLight);

    const pointLight = new DirectionalLight("#fff", 10);
    scene.add(pointLight);
  }

  function configureControls(controls: OrbitControls) {
    const controlsConfig = config.controls || {};
    const animationConfig = config.animation || {};

    // Apply control configurations
    controls.enableRotate = controlsConfig.enableRotate ?? true;
    controls.enableZoom = controlsConfig.enableZoom ?? true;
    controls.enablePan = controlsConfig.enablePan ?? false;
    controls.enableDamping = controlsConfig.enableDamping ?? true;
    controls.dampingFactor = controlsConfig.dampingFactor ?? 0.25;
    controls.maxPolarAngle = controlsConfig.maxPolarAngle ?? Math.PI / 2;
    controls.minZoom = controlsConfig.minZoom ?? 0.4;
    controls.maxZoom = controlsConfig.maxZoom ?? 5;

    // Apply animation configurations
    controls.autoRotate = animationConfig.enableAutoRotate ?? false;
    controls.autoRotateSpeed = animationConfig.autoRotateSpeed ?? 2;
  }

  return (
    <ThreeDimensionModelViewer
      decoderPath={DRACO_DIRECTORY}
      modelPath={MODEL}
      modelScale={1.4}
      configureScene={configureScene}
      configureControls={configureControls}
      autoRotate={config.animation?.enableAutoRotate}
      enableInitialAnimation={config.animation?.enableInitialAnimation}
      initializationDelay={config.animation?.initializationDelay}
      minHorizontalScale={config.minHorizontalScale ?? 7}
      class={props.class}
      loadingElement={
        <LoadingModelPreview src={ThumbnailPaths.ENVELOPE} alt={TranslationKeys.common_envelope} class="size-[80%]" />
      }
    />
  );
}
