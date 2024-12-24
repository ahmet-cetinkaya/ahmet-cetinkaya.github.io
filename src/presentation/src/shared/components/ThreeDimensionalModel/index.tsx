import Icons from "~/domain/data/Icons";
import Envelope3DModel from "./Envelope3DModel";
import Computer3DModel from "./Computer3DModel";
import Terminal3DModel from "./Terminal3DModel";
import Doom3DModel from "./Doom3DModel";

type Props = {
  model: Icons;
  class?: string;
};

export default function ThreeDimensionalModel(props: Props) {
  switch (props.model) {
    case Icons.computer:
      return <Computer3DModel />;
    case Icons.envelope:
      return <Envelope3DModel />;
    case Icons.terminal:
      return <Terminal3DModel />;
    case Icons.doom:
      return <Doom3DModel />;
    default:
      throw new Error("3D Model not found: " + props.model);
  }
}
