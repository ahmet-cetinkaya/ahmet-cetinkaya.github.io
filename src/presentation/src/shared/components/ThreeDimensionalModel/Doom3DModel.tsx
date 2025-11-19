import { Scene, DirectionalLight } from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { TranslationKeys } from "@domain/data/Translations";
import LoadingModelPreview from "./Loading3DModelPreview";
import ThreeDimensionModelViewer from "@packages/acore-solidjs/ui/components/ThreeDimensionModelViewer";
import DoomModelPreview from "./assets/images/doom-model-preview.webp";
import { DRACO_DIRECTORY } from "./constants/draco";

type Props = {
  class?: string;
};

const MODEL = "/models/doom.glb";

export default function Doom3DModel(props: Props) {
  function configureScene(scene: Scene) {
    // Lights
    const directionalLight = new DirectionalLight("#ffffff", 6);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    const directionalLight2 = new DirectionalLight("#ffffff", 6);
    directionalLight2.position.set(0, -10, -10);
    scene.add(directionalLight2);
  }

  function configureModel(gltf: GLTF) {
    gltf.scene.position.x = -2.5;
    gltf.scene.position.y = -3;
  }

  return (
    <ThreeDimensionModelViewer
      decoderPath={DRACO_DIRECTORY}
      modelPath={MODEL}
      modelScale={0.2}
      configureScene={configureScene}
      configureModel={configureModel}
      class={props.class}
      loadingElement={<LoadingModelPreview src={DoomModelPreview.src} alt={TranslationKeys.common_envelope} />}
    />
  );
}
