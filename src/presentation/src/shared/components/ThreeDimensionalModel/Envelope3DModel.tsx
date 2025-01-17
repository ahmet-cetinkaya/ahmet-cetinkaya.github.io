import { Scene, AmbientLight, DirectionalLight } from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { TranslationKeys } from "~/domain/data/Translations";
import LoadingModelPreview from "./Loading3DModelPreview";
import ThreeDimensionModelViewer from "~/presentation/src/core/acore-solidjs/ui/components/ThreeDimensionModelViewer";
import EnvelopeModelPreview from "./assets/images/envelope-model-preview.webp";
import { DRACO_DIRECTORY } from "./constants/draco";

type Props = {
  class?: string;
};

const MODEL = "/models/envelope.glb";

export default function Envelope3DModel(props: Props) {
  function configureScene(scene: Scene) {
    // Lights
    const ambientLight = new AmbientLight("#fff", 1);
    scene.add(ambientLight);

    const pointLight = new DirectionalLight("#fff", 10);
    scene.add(pointLight);
  }

  function configureModel(gltf: GLTF) {
    gltf.scene.position.y = -3;
  }

  return (
    <ThreeDimensionModelViewer
      decoderPath={DRACO_DIRECTORY}
      modelPath={MODEL}
      modelScale={0.055}
      configureScene={configureScene}
      configureModel={configureModel}
      class={props.class}
      loadingElement={<LoadingModelPreview src={EnvelopeModelPreview.src} alt={TranslationKeys.common_envelope} />}
    />
  );
}
