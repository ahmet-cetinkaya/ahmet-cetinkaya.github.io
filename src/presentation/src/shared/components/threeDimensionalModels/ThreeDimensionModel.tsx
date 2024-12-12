import Icons from "~/domain/data/Icons";
import { AmbientLight, PointLight, type Scene } from "three";
import ThreeDimensionModelViewer from "./ThreeDimensionModelViewer";
import type { GLTF } from "three/examples/jsm/Addons.js";
import Image from "../ui/Image";
import useI18n from "../../utils/i18nTranslate";
import { TranslationKeys } from "~/domain/data/Translations";
import ComputerModelPreview from "./assets/images/retro-computer-model-preview.webp";
import EnvelopeModelPreview from "./assets/images/envelope-model-preview.webp";

type Props = {
  model: Icons;
  class?: string;
};

export default function Model(props: Props) {
  const translate = useI18n();

  switch (props.model) {
    case Icons.computer:
      return <ComputerModel />;
    case Icons.envelope:
      return <EnvelopeModel />;
    default:
      return <span class="text-xs text-red-500">Model not found!</span>;
  }

  function ComputerModel(props: { class?: string }) {
    function configureScene(scene: Scene) {
      // Lights
      const ambientLight = new AmbientLight("#fff", 1.2);
      scene.add(ambientLight);

      const pointLight = new PointLight("#965eff", 160);
      pointLight.position.set(0.25, 0.5, 5);
      pointLight.distance = 4.8;
      scene.add(pointLight);
    }

    return (
      <ThreeDimensionModelViewer
        modelPath={"/models/computer/retro_computer_compressed.glb"}
        modelScale={16.55}
        configureScene={configureScene}
        class={props.class}
        loadingElement={<LoadingModelPreview src={ComputerModelPreview.src} alt={TranslationKeys.common_computer} />}
      />
    );
  }

  function EnvelopeModel(props: { class?: string }) {
    function configureScene(scene: Scene) {
      // Lights
      const ambientLight = new AmbientLight("#fff", 1.3);
      scene.add(ambientLight);

      const pointLight = new PointLight("#fff", 50);
      pointLight.position.set(3, 0, -1.6);
      pointLight.distance = 10;
      scene.add(pointLight);

      const pointLight2 = new PointLight("#fff", 50);
      pointLight2.position.set(-2, 0, -1.4);
      pointLight2.distance = 10;
      scene.add(pointLight2);
    }

    function configureModel(gltf: GLTF) {
      gltf.scene.position.x = 0;
      gltf.scene.position.y = 0;
      gltf.scene.rotation.y = 10.5;
    }

    return (
      <ThreeDimensionModelViewer
        modelPath="/models/envelope_compressed.glb"
        modelScale={7}
        configureScene={configureScene}
        configureModel={configureModel}
        class={props.class}
        loadingElement={<LoadingModelPreview src={EnvelopeModelPreview.src} alt={TranslationKeys.common_envelope} />}
      />
    );
  }

  function LoadingModelPreview(props: { src: string; alt: TranslationKeys }) {
    return (
      <span class="flex size-full items-center justify-center px-4">
        <Image class="object-contain object-center" src={props.src} alt={translate(props.alt)} />
      </span>
    );
  }
}
