import type { TranslationKeys } from "~/domain/data/Translations";
import Image from "~/presentation/src/core/acore-solidjs/ui/components/Image";
import { useI18n } from "../../utils/i18nTranslate";

type Props = {
  src: string;
  alt: TranslationKeys;
};

export default function LoadingModelPreview(props: Props) {
  const translate = useI18n();

  return (
    <span class="flex size-full items-center justify-center px-4">
      <Image class="object-contain object-center" src={props.src} alt={translate(props.alt)} loading="eager" />
    </span>
  );
}
