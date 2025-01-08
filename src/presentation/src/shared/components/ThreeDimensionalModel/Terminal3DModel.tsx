import { Scene, DirectionalLight, SpotLight } from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { TranslationKeys } from "~/domain/data/Translations";
import LoadingModelPreview from "./Loading3DModelPreview";
import ThreeDimensionModelViewer from "~/presentation/src/core/acore-solidjs/ui/components/ThreeDimensionModelViewer";
import TerminalModelPreview from "./assets/images/terminal-model-preview.webp";
import { DRACO_DIRECTORY } from "./constants/draco";

type Props = {
  class?: string;
};

const MODEL = "/models/terminal/terminal.glb";

export default function Terminal3DModel(props: Props) {
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

  function configureModel(gltf: GLTF) {
    gltf.scene.position.x = 0;
    gltf.scene.position.y = 0;
    gltf.scene.rotation.y = 6;
  }

  return (
    <ThreeDimensionModelViewer
      decoderPath={DRACO_DIRECTORY}
      modelPath={MODEL}
      modelScale={3}
      configureScene={configureScene}
      configureModel={configureModel}
      class={props.class}
      loadingElement={<LoadingModelPreview src={TerminalModelPreview.src} alt={TranslationKeys.common_envelope} />}
    />
  );
}
