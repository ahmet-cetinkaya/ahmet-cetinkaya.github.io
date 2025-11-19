import type { JSX } from "solid-js/jsx-runtime";

import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";
import { buttonVariantClassNames } from "./Button";

const linkVariantClassNames = {
  ...buttonVariantClassNames,
};

type LinkVariant = keyof typeof linkVariantClassNames;
type Props = {
  ariaLabel: string;
  children: JSX.Element;
  class?: string;
  draggable?: boolean;
  href: string;
  onClick?: (e: MouseEvent) => void;
  onDragStart?: (e: DragEvent) => void;
  rel?: "noopener noreferrer";
  target?: "_blank" | "_self" | "_parent" | "_top";
  variant?: LinkVariant;
};

export default function Link(props: Props) {
  return (
    <a
      href={props.href}
      onClick={props.onClick}
      onDragStart={props.onDragStart}
      class={mergeCls(
        "flex items-center justify-center",
        linkVariantClassNames[props.variant ?? "primary"],
        props.class,
      )}
      target={props.target}
      rel={props.rel}
      aria-label={props.ariaLabel}
    >
      {props.children}
    </a>
  );
}
