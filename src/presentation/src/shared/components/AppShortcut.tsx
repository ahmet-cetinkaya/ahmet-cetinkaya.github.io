import type { JSX } from "solid-js/jsx-runtime";
import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";
import type { TranslationKey } from "@domain/data/Translations";
import { useI18n } from "@shared/utils/i18nTranslate";
import Link from "@shared/components/ui/Link";

type Props = {
  class?: string;
  href?: string;
  icon: JSX.Element;
  label: TranslationKey;
  onClick?: (e: MouseEvent) => void;
  onDragStart?: (e: DragEvent) => void;
};

export default function AppShortcut(props: Props) {
  const translate = useI18n();

  const content = (
    <figure class="size-full max-h-20">
      <picture class="size-full">{props.icon}</picture>
      <figcaption class="flex justify-center px-6">
        <div class="bg-surface-500 shadow-primary w-full truncate rounded-lg text-center text-wrap">
          {translate(props.label)}
        </div>
      </figcaption>
    </figure>
  );

  if (!props.href) {
    return (
      <div
        draggable={true}
        onClick={props.onClick}
        onDragStart={props.onDragStart}
        class={mergeCls(
          "flex size-full flex-col items-center justify-center transition-colors duration-200 ease-in-out hover:text-gray-400",
          props.class,
        )}
        aria-label={translate(props.label)}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={props.href}
      draggable={true}
      onClick={props.onClick}
      onDragStart={props.onDragStart}
      class={mergeCls(
        "flex size-full flex-col items-center justify-center transition-colors duration-200 ease-in-out hover:text-gray-400",
        props.class,
      )}
      variant="text"
      ariaLabel={translate(props.label)}
    >
      {content}
    </Link>
  );
}
