import type { JSX } from "solid-js/jsx-runtime";

import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import { buttonVariantClassNames } from "./Button";

const linkVariantClassNames = {
  ...buttonVariantClassNames,
};

type LinkVariant = keyof typeof linkVariantClassNames;
interface Props {
  href: string;
  children: JSX.Element;
  draggable?: boolean;
  variant?: LinkVariant;
  class?: string;
  onClick?: (e: MouseEvent) => void;
  onDragStart?: (e: DragEvent) => void;
}

export default function Link(props: Props) {
  return (
    <a
      href={props.href}
      onClick={props.onClick}
      onDragStart={props.onDragStart}
      class={mergeCls(linkVariantClassNames[props.variant ?? "primary"], props.class)}
    >
      {props.children}
    </a>
  );
}
