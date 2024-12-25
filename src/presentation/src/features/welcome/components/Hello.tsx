import { useI18n } from "~/presentation/src/shared/utils/i18nTranslate";
import SocialButtons from "./SocialButtons";
import { TranslationKeys } from "~/domain/data/Translations";
import Title from "~/presentation/src/shared/components/ui/Title";
import ThreeDimensionalModel from "~/presentation/src/shared/components/ThreeDimensionalModel";
import Icons from "~/domain/data/Icons";

export default function Hello() {
  const translate = useI18n();

  return (
    <div class="flex size-full flex-col md:flex-row">
      <div class="basis-1/2">
        <ThreeDimensionalModel model={Icons.computer} />
      </div>
      <div class="flex flex-1 flex-col md:justify-center">
        <Title level={1} class="font-bold">
          Ahmet Çetinkaya
        </Title>
        <p class="mt-2 text-lg">{translate(TranslationKeys.apps_welcome_about_me_short_text)}</p>
        <SocialButtons class="mt-6" />
      </div>
    </div>
  );
}
