import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import type { Icons } from "~/domain/data/Icons";
import IconSvgs from "../constants/IconSvgs";

type Props = {
  icon: Icons;
  isSpin?: boolean;
  onClick?: () => void;
  class?: string;
};

export default function Icon(props: Props) {
  const iconSvg = IconSvgs[props.icon];

  return (
    <svg
      onClick={props.onClick}
      innerHTML={iconSvg}
      class={mergeCls(props.class, {
        "animate-spin": props.isSpin ?? false,
      })}
    />
  );
}
