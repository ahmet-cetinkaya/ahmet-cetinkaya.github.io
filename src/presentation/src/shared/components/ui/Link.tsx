import type { JSX } from "solid-js/jsx-runtime";

import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import { buttonVariantClassNames } from "./Button";

const linkVariantClassNames = {
  ...buttonVariantClassNames,
};

type LinkVariant = keyof typeof linkVariantClassNames;
type Props = {
  href: string;
  children: JSX.Element;
  ariaLabel: string;
  draggable?: boolean;
  variant?: LinkVariant;
  class?: string;
  onClick?: (e: MouseEvent) => void;
  onDragStart?: (e: DragEvent) => void;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: "noopener noreferrer";
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
