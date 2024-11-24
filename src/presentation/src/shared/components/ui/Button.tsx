import { type JSX } from "solid-js";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";

export const buttonVariantClassNames = {
  primary:
    "inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 transition-colors ease-linear",
  link: "text-blue-500 hover:text-blue-700 focus:outline-none",
  text: "text-gray-700 hover:text-gray-900 focus:outline-none",
};

type ButtonType = "button" | "submit" | "reset";
type ButtonVariant = keyof typeof buttonVariantClassNames;
interface Props {
  type?: ButtonType;
  label?: string;
  children?: JSX.Element;
  variant?: ButtonVariant;
  className?: string;
  onClick?: (e: MouseEvent) => void;
}

export default function Button(props: Props) {
  return (
    <button
      type={props.type}
      class={mergeCls(buttonVariantClassNames[props.variant ?? "primary"], props.className)}
      onClick={props.onClick}
    >
      {props.label || props.children}
    </button>
  );
}
