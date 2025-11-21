import { useI18n } from "@shared/utils/i18nTranslate";
import SocialButtons from "./SocialButtons";
import { TranslationKeys } from "@domain/data/Translations";
import Title from "@shared/components/ui/Title";
import ThreeDimensionalModel from "@shared/components/ThreeDimensionalModel";
import Icons from "@domain/data/Icons";
import { DefaultConfigs } from "@shared/components/ThreeDimensionalModel/constants/defaultConfigs";

export default function Hello() {
  const translate = useI18n();

  return (
    <div class="flex size-full flex-col px-8 py-4 md:flex-row">
      <div class="basis-1/2">
        <ThreeDimensionalModel model={Icons.computer} config={DefaultConfigs.full} />
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
