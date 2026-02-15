import { lazy, Suspense } from "solid-js";
import { useI18n } from "@shared/utils/i18nTranslate";
import SocialButtons from "./SocialButtons";
import { TranslationKeys } from "@domain/data/Translations";
import Title from "@shared/components/ui/Title";
import Icons from "@domain/data/Icons";
import { DefaultConfigs } from "@shared/components/ThreeDimensionalModel/constants/defaultConfigs";

// Lazy load the heavy ThreeDimensionalModel component
const ThreeDimensionalModel = lazy(() => import("@shared/components/ThreeDimensionalModel/ThreeDimensionalModel"));

export default function Hello() {
  const translate = useI18n();

  return (
    <div class="flex size-full flex-col px-8 py-4 md:flex-row">
      <div class="basis-1/2">
        <Suspense fallback={<div class="h-64 w-full animate-pulse rounded-lg bg-gray-200" />}>
          <ThreeDimensionalModel model={Icons.computer} config={DefaultConfigs.full} />
        </Suspense>
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
