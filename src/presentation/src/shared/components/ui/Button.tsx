import { type JSX } from "solid-js";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";

export const buttonVariantClassNames = {
  primary:
    "select-none inline-flex w-full justify-center rounded-lg border border-black bg-surface-400 shadow-primary px-4 py-2 text-sm font-medium text-gray-200 shadow-sm hover:bg-surface-300 focus:shadow-none transition-all ease-linear duration-200 focus:outline-none hov",
  link: "text-blue-500 hover:text-blue-700 focus:outline-none",
  text: "text-gray-200 hover:text-gray-400 focus:outline-none",
};

const buttonSizeClassNames = {
  small: "px-2 py-1 text-xs",
  medium: "px-4 py-2 text-sm",
  large: "px-6 py-3 text-lg",
};

type ButtonType = "button" | "submit" | "reset";
type ButtonVariant = keyof typeof buttonVariantClassNames;
type ButtonSize = keyof typeof buttonSizeClassNames;

type Props = {
  children: JSX.Element;
  type?: ButtonType;
  variant?: ButtonVariant;
  class?: string;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: (e: MouseEvent) => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
};

const defaultProps: Props = {
  children: <></>,
  type: "button",
  variant: "primary",
  size: "medium",
};

export default function Button(props: Props) {
  if (!props.children) props.children = defaultProps.children;
  if (!props.variant) props.variant = defaultProps.variant;
  if (!props.size) props.size = defaultProps.size;
  if (!props.type) props.type = defaultProps.type;

  return (
    <button
      type={props.type}
      class={mergeCls(
        buttonVariantClassNames[props.variant!],
        buttonSizeClassNames[props.size!],
        props.class,
        {
          "cursor-not-allowed opacity-50": Boolean(props.disabled),
        },
        "overflow-hidden",
      )}
      disabled={props.disabled}
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      <span onClick={(event) => event.stopPropagation()} class={"pointer-events-none"}>
        {props.children}
      </span>
    </button>
  );
}
