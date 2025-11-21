import { Scene, DirectionalLight, SpotLight } from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { TranslationKeys } from "@domain/data/Translations";
import LoadingModelPreview from "./Loading3DModelPreview";
import ThreeDimensionModelViewer from "@packages/acore-solidjs/ui/components/ThreeDimensionModelViewer";
import { DRACO_DIRECTORY } from "./constants/draco";
import ModelPaths from "@shared/constants/ModelPaths";
import type { Model3DConfig } from "./models";
import { DefaultConfigs } from "./constants/defaultConfigs";
const TerminalModelPreview = "/home/ac/Models/terminal/terminal-thumbnail.webp";

type Props = {
  class?: string;
  config?: Model3DConfig;
};

const MODEL = ModelPaths.TERMINAL;

export default function Terminal3DModel(props: Props) {
  const config = props.config || DefaultConfigs.full;

  function configureScene(scene: Scene) {
    // Lights
    const directionalLight = new DirectionalLight("#ffffff", 3);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    const directionalLight2 = new DirectionalLight("#ffffff", 3);
    directionalLight2.position.set(0, -10, -10);
    scene.add(directionalLight2);

    const spotLight = new SpotLight("#ffffff", 200);
    spotLight.position.set(0, 10, -10);
    scene.add(spotLight);

    const spotLight2 = new SpotLight("#ffffff", 200);
    spotLight2.position.set(0, -10, 10);
    scene.add(spotLight2);
  }

  function configureControls(controls: any) {
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
    gltf.scene.position.x = 0;
    gltf.scene.position.y = 0;
    gltf.scene.rotation.y = 6;
  }

  return (
    <ThreeDimensionModelViewer
      decoderPath={DRACO_DIRECTORY}
      modelPath={MODEL}
      modelScale={2.9}
      configureScene={configureScene}
      configureModel={configureModel}
      configureControls={configureControls}
      autoRotate={config.animation?.enableAutoRotate}
      enableInitialAnimation={config.animation?.enableInitialAnimation}
      initializationDelay={config.animation?.initializationDelay}
      class={props.class}
      loadingElement={
        <LoadingModelPreview src={TerminalModelPreview} alt={TranslationKeys.apps_terminal} class="h-[85%] w-[85%]" />
      }
    />
  );
}
