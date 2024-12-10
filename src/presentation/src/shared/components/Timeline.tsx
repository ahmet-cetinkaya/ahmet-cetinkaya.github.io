import { Index, Show } from "solid-js";
import type { Icons } from "~/domain/data/Icons";
import { TranslationKeys, type TranslationKey } from "~/domain/data/Translations";
import useI18n from "../utils/i18nTranslate";
import Icon from "./Icon";
import LessViewContent from "./LessViewContent";
import MarkdownParagraph from "./MarkdownParagraph";

export type Activity = {
  id: number;
  title: TranslationKey;
  subtitle?: TranslationKey;
  logo: Icons;
  descriptionMarkdown?: TranslationKey;
  startDate: Date;
  endDate?: Date;
};

type Props = {
  activities: Activity[];
};

export default function Timeline(props: Props) {
  const translate = useI18n();

  return (
    <section class="relative">
      <Index each={props.activities.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())}>
        {(activity) => (
          <section class="relative mb-8 flex gap-4">
            <div class="size-12">
              <div class="flex size-12 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200">
                <Icon icon={activity().logo} class="size-12" />
              </div>
            </div>
            <div>
              <header>
                <h3 class="text-lg font-semibold">{translate(activity().title)}</h3>
                <Show when={activity().subtitle}>
                  <h4 class="text-gray-400">{translate(activity().subtitle!)}</h4>
                </Show>

                <time class="text-sm text-gray-300">{activity().startDate.toDateString()}</time>
                <Show
                  when={activity().endDate}
                  fallback={
                    <time class="text-sm text-gray-300"> - {translate(TranslationKeys.apps_welcome_present)}</time>
                  }
                >
                  <time class="text-sm text-gray-300"> - {activity().endDate!.toDateString()}</time>
                </Show>
              </header>

              <Show when={activity().descriptionMarkdown}>
                <LessViewContent>
                  <MarkdownParagraph content={translate(activity().descriptionMarkdown!)} class="text-sm" />
                </LessViewContent>
              </Show>
            </div>
          </section>
        )}
      </Index>
    </section>
  );
}
