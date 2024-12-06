import { AmbientLight, PointLight, Scene } from "three";
import ThreeDimensionModelViewer from "./ThreeDimensionModelViewer";

type Props = {
  class?: string;
};

export default function ComputerModel(props: Props) {
  return (
    <ThreeDimensionModelViewer
      modelPath={"/models/computer/retro_computer_compressed.glb"}
      modelScale={16.55}
      configureScene={(scene: Scene) => {
        // Lights
        const ambientLight = new AmbientLight("#fff", 1.2);
        scene.add(ambientLight);
        const pointLight = new PointLight("#965eff", 160);
        pointLight.position.set(0.25, 0.5, 5);
        pointLight.distance = 4.8;
        scene.add(pointLight);
      }}
      class={props.class}
    />
  );
}
