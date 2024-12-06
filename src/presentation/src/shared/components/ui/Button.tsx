import { type JSX } from "solid-js";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";

export const buttonVariantClassNames = {
  primary:
    "inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 transition-colors ease-linear",
  link: "text-blue-500 hover:text-blue-700 focus:outline-none",
  text: "text-gray-700 hover:text-gray-900 focus:outline-none",
};

const buttonSizeClassNames = {
  small: "px-2 py-1 text-xs",
  medium: "px-4 py-2 text-sm",
  large: "px-6 py-3 text-lg",
};

type ButtonType = "button" | "submit" | "reset";
type ButtonVariant = keyof typeof buttonVariantClassNames;
type ButtonSize = keyof typeof buttonSizeClassNames;

interface Props {
  type?: ButtonType;
  label?: string;
  children?: JSX.Element;
  variant?: ButtonVariant;
  class?: string;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: (e: MouseEvent) => void;
}

export default function Button(props: Props) {
  return (
    <button
      type={props.type}
      class={mergeCls(
        buttonVariantClassNames[props.variant ?? "primary"],
        buttonSizeClassNames[props.size ?? "medium"],
        props.class,
        {
          "cursor-not-allowed opacity-50": Boolean(props.disabled),
        },
      )}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.label || props.children}
    </button>
  );
}
