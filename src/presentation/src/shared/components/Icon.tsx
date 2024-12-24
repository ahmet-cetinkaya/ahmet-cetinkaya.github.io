import type Icons from "~/domain/data/Icons";
import IconSvgs from "../constants/IconSvgs";
import { createMemo } from "solid-js";
import SvgIcon from "~/core/acore-solidjs/ui/components/SvgIcon";

type Props = {
  icon: Icons;
  isSpin?: boolean;
  onClick?: () => void;
  class?: string;
  fillColor?: string;
};

export default function Icon(props: Props) {
  const iconSvg = createMemo(() => IconSvgs[props.icon]);

  return (
    <SvgIcon
      svg={iconSvg()}
      alt={props.icon}
      isSpin={props.isSpin}
      onClick={props.onClick}
      class={props.class}
      fillColor={props.fillColor}
    />
  );
}
