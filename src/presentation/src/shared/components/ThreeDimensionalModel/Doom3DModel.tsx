import { Scene, DirectionalLight } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { TranslationKeys } from "@domain/data/Translations";
import LoadingModelPreview from "./Loading3DModelPreview";
import ThreeDimensionModelViewer from "@packages/acore-solidjs/ui/components/ThreeDimensionModelViewer";
import { DRACO_DIRECTORY } from "./constants/draco";
import ModelPaths from "@shared/constants/ModelPaths";
import type { Model3DConfig } from "./models";
import { DefaultConfigs } from "./constants/defaultConfigs";
const DoomModelPreview = "/home/ac/Models/doom/doom-thumbnail.webp";

type Props = {
  class?: string;
  config?: Model3DConfig;
};

const MODEL = ModelPaths.DOOM;

export default function Doom3DModel(props: Props) {
  const config = props.config || DefaultConfigs.full;

  function configureScene(scene: Scene) {
    // Lights
    const directionalLight = new DirectionalLight("#ffffff", 6);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    const directionalLight2 = new DirectionalLight("#ffffff", 6);
    directionalLight2.position.set(0, -10, -10);
    scene.add(directionalLight2);
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

  function configureModel(gltf: GLTF) {
    gltf.scene.position.x = -2.3;
    gltf.scene.position.y = -2.9;
  }

  return (
    <ThreeDimensionModelViewer
      decoderPath={DRACO_DIRECTORY}
      modelPath={MODEL}
      modelScale={0.22}
      configureScene={configureScene}
      configureModel={configureModel}
      configureControls={configureControls}
      autoRotate={config.animation?.enableAutoRotate}
      enableInitialAnimation={config.animation?.enableInitialAnimation}
      initializationDelay={config.animation?.initializationDelay}
      class={props.class}
      loadingElement={
        <LoadingModelPreview src={DoomModelPreview} alt={TranslationKeys.apps_doom} class="h-[100%] w-[100%]" />
      }
    />
  );
}
