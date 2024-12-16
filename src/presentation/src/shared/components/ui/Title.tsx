import { type JSX } from "solid-js";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";

type Props = {
  children: JSX.Element;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  class?: string;
};

const sizeClasses = {
  1: "text-4xl",
  2: "text-3xl",
  3: "text-2xl",
  4: "text-xl",
  5: "text-lg",
  6: "text-base",
};
const classes = "mb-3 font-bold";

export default function Title(props: Props) {
  if (props.level === undefined) props.level = 1;

  const sizeClass = sizeClasses[props.level || 1];

  switch (props.level) {
    case 1:
      return <h1 class={mergeCls(sizeClass, classes, props.class)}>{props.children}</h1>;
    case 2:
      return <h2 class={mergeCls(sizeClass, classes, props.class)}>{props.children}</h2>;
    case 3:
      return <h3 class={mergeCls(sizeClass, classes, props.class)}>{props.children}</h3>;
    case 4:
      return <h4 class={mergeCls(sizeClass, classes, props.class)}>{props.children}</h4>;
    case 5:
      return <h5 class={mergeCls(sizeClass, classes, props.class)}>{props.children}</h5>;
    case 6:
      return <h6 class={mergeCls(sizeClass, classes, props.class)}>{props.children}</h6>;
  }
}
