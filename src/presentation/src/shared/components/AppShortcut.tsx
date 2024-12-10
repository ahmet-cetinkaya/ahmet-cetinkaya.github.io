import type { JSX } from "solid-js/jsx-runtime";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import type { TranslationKey } from "~/domain/data/Translations";
import useI18n from "../utils/i18nTranslate";
import Link from "./ui/Link";

type Props = {
  label: TranslationKey;
  href: string;
  icon: JSX.Element;
  onClick?: () => void;
  onDragStart?: () => void;
  class?: string;
};

export default function AppShortcut(props: Props) {
  const translate = useI18n();

  return (
    <Link
      href={props.href}
      draggable={true}
      onClick={props.onClick}
      onDragStart={props.onDragStart}
      class={mergeCls("flex size-full flex-col items-center justify-center hover:text-gray-400", props.class)}
      variant="text"
    >
      <figure class="size-full max-h-20">
        <picture class="size-full">{props.icon}</picture>
        <figcaption class="flex justify-center px-6">
          <div class="w-full truncate text-wrap rounded-lg bg-surface-500 text-center shadow-primary">
            {translate(props.label)}
          </div>
        </figcaption>
      </figure>
    </Link>
  );
}