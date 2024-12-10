import ComputerModel from "~/presentation/src/shared/components/threeDimensionalModels/ComputerModel";
import useI18n from "~/presentation/src/shared/utils/i18nTranslate";
import SocialButtons from "./SocialButtons";
import { TranslationKeys } from "~/domain/data/Translations";

export default function Hello() {
  const translate = useI18n();

  return (
    <div class="flex size-full flex-col md:flex-row">
      <div class="basis-1/2">
        <ComputerModel />
      </div>
      <div class="flex flex-1 flex-col md:justify-center">
        <h1 class="text-4xl font-bold">Ahmet Çetinkaya</h1>
        <p class="mt-2 text-lg">{translate(TranslationKeys.apps_welcome_about_me_short_text)}</p>
        <SocialButtons class="mt-6" />
      </div>
    </div>
  );
}
