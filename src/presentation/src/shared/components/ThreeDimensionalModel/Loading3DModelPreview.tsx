import type { TranslationKeys } from "@domain/data/Translations";
import Image from "@packages/acore-solidjs/ui/components/Image";
import { useI18n } from "@shared/utils/i18nTranslate";

type Props = {
  src: string;
  alt: TranslationKeys;
  class?: string;
};

export default function LoadingModelPreview(props: Props) {
  const translate = useI18n();

  return (
    <span class="flex size-full items-center justify-center px-4">
      <Image
        class={`object-contain object-center transition-all duration-200 ${props.class || ""}`}
        src={props.src}
        alt={translate(props.alt)}
        loading="eager"
      />
    </span>
  );
}
