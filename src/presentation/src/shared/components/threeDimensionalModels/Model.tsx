import { Icons } from "~/domain/data/Icons";
import ComputerModel from "./ComputerModel";
import EnvelopeModel from "./EnvelopeModel";

type Props = {
  model: Icons;
};

export default function Model(props: Props) {
  switch (props.model) {
    case Icons.computer:
      return <ComputerModel />;
    case Icons.envelope:
      return <EnvelopeModel />;
    default:
      console.error("Model not found:", props.model);
      return <span class="text-xs text-red-500">Model not found</span>;
  }
}
