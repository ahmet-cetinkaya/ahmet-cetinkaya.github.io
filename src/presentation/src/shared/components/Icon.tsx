import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import type { Icons } from "~/domain/data/Icons";
import IconSvgs from "../constants/IconSvgs";

type Props = {
  icon: Icons;
  isSpin?: boolean;
  onClick?: () => void;
  class?: string;
  fillColor?: string;
};

export default function Icon(props: Props) {
  const iconSvg = IconSvgs[props.icon];

  function getFilledSvg() {
    return iconSvg.replace(/fill=".*?"/g, `fill="${props.fillColor}"`);
  }

  return (
    <svg
      onClick={props.onClick}
      innerHTML={props.fillColor ? getFilledSvg() : iconSvg}
      class={mergeCls(props.class, {
        "animate-spin": props.isSpin ?? false,
      })}
      style={{ fill: props.fillColor }}
    />
  );
}
