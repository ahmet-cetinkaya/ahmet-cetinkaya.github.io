import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import type Icons from "~/domain/data/Icons";
import IconSvgs from "../constants/IconSvgs";
import { createMemo } from "solid-js";

type Props = {
  icon: Icons;
  isSpin?: boolean;
  onClick?: () => void;
  class?: string;
  fillColor?: string;
};

export default function Icon(props: Props) {
  const iconSvg = createMemo(() => IconSvgs[props.icon]);

  const getFilledSvg = createMemo(() => {
    return iconSvg().replace(/fill=".*?"/g, `fill="${props.fillColor}"`);
  });

  return (
    <svg
      onClick={props.onClick}
      innerHTML={props.fillColor ? getFilledSvg() : iconSvg()}
      class={mergeCls(props.class, {
        "animate-spin": props.isSpin ?? false,
      })}
      style={{ fill: props.fillColor }}
    />
  );
}
