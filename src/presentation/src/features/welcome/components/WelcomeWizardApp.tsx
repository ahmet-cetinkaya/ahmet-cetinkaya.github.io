import { createSignal, Index, Show } from "solid-js";
import type { IWindowsService } from "~/application/features/desktop/services/abstraction/IWindowsService";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import { Apps } from "~/domain/data/Apps";
import { TranslationKeys, type TranslationKey } from "~/domain/data/Translations";
import { Container } from "~/presentation/Container";
import Button from "~/presentation/src/shared/components/ui/Button";
import useI18n from "~/presentation/src/shared/utils/i18nTranslate";
import About from "./About";
import Background from "./Background";
import Completed from "./Completed";
import Hello from "./Hello";
import Technologies from "./Technologies";

const PARTS: TranslationKey[] = [
  TranslationKeys.apps_welcome_hello,
  TranslationKeys.apps_welcome_about_me,
  TranslationKeys.apps_welcome_technologies,
  TranslationKeys.apps_welcome_background,
  TranslationKeys.apps_welcome_completed,
];
enum Parts {
  Hello,
  AboutMe,
  Technologies,
  Background,
  Completed,
}

export default function WelcomeWizardApp() {
  const windowsService: IWindowsService = Container.instance.windowsService;

  const translate = useI18n();

  const [currentPart, setCurrentPart] = createSignal(0);

  const [isAboutConfirmed, setIsAboutConfirmed] = createSignal(false);
  const [isWarnedForConfirm, setIsWarnedForConfirm] = createSignal(false);

  function onPartClicked(index: number) {
    if (index >= PARTS.length) {
      closeApp();
      return;
    }

    setCurrentPart(index);
  }

  function getPartContent(index: number) {
    switch (index) {
      case Parts.Hello:
        return <Hello />;
      case Parts.AboutMe:
        return (
          <About
            initialConfirmValue={isAboutConfirmed()}
            isWarnedForConfirm={isWarnedForConfirm()}
            onConfirm={onAboutConfirm}
          />
        );
      case Parts.Technologies:
        return <Technologies />;
      case Parts.Background:
        return <Background />;
      case Parts.Completed:
        return <Completed />;
      default:
        throw new Error(`Part (${index}) not found.`);
    }
  }

  function closeApp() {
    windowsService.remove((w) => w.appId === Apps.welcome);
  }

  function onAboutConfirm(value: boolean) {
    setIsAboutConfirmed(value);
  }

  function onNextPart() {
    if (currentPart() >= PARTS.length - 1) {
      closeApp();
      return;
    }

    if (currentPart() === Parts.AboutMe && !isAboutConfirmed()) {
      setIsWarnedForConfirm(true);
      return;
    }
    if (isWarnedForConfirm()) setIsWarnedForConfirm(false);

    setCurrentPart(currentPart() + 1);
  }

  function onPrevPart() {
    if (currentPart() === 0) return;

    setCurrentPart(currentPart() - 1);
  }

  function isNextPartAvailable(index?: number) {
    if (index !== undefined) {
      if (index < Parts.AboutMe) return true;
      if (index === Parts.AboutMe && isWarnedForConfirm() && !isAboutConfirmed()) return false;
      if (index > Parts.AboutMe && !isAboutConfirmed()) return false;
    } else {
      if (currentPart() === Parts.AboutMe && isWarnedForConfirm() && !isAboutConfirmed()) return false;
    }
    return true;
  }

  return (
    <div class="flex h-full flex-row gap-4">
      <header class="basis-1/4">
        <ul>
          <Index each={PARTS}>
            {(part, index) => (
              <li>
                <Button
                  onClick={() => onPartClicked(index)}
                  variant="text"
                  class={mergeCls({
                    "font-bold": currentPart() === index,
                  })}
                  disabled={!isNextPartAvailable(index)}
                >
                  {translate(part())}
                </Button>
              </li>
            )}
          </Index>
        </ul>
      </header>
      <div class="flex size-full flex-col overflow-hidden">
        <Show when={currentPart() < PARTS.length}>
          <main class="flex-grow overflow-auto">{getPartContent(currentPart())}</main>
        </Show>

        <footer class="mb-2 me-2 flex flex-row-reverse justify-start gap-2">
          <Button onClick={onNextPart} class="w-16" size="small">
            {currentPart() < PARTS.length - 1
              ? translate(TranslationKeys.common_next)
              : translate(TranslationKeys.apps_welcome_finish)}
          </Button>
          <Button onClick={onPrevPart} class="w-16" disabled={currentPart() === 0} size="small">
            {translate(TranslationKeys.common_prev)}
          </Button>
        </footer>
      </div>
    </div>
  );
}
