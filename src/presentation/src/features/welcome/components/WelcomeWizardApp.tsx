import { createSignal, Index, Show } from "solid-js";
import type IWindowsService from "~/application/features/desktop/services/abstraction/IWindowsService";
import { mergeCls } from "~/presentation/src/core/acore-ts/ui/ClassHelpers";
import { Apps } from "~/domain/data/Apps";
import { TranslationKeys, type TranslationKey } from "~/domain/data/Translations";
import Container from "~/presentation/Container";
import Button from "~/presentation/src/shared/components/ui/Button";
import { useI18n } from "~/presentation/src/shared/utils/i18nTranslate";
import About from "./About";
import Background from "./Background";
import Completed from "./Completed";
import Hello from "./Hello";
import Technologies from "./Technologies";
import Title from "~/presentation/src/shared/components/ui/Title";
import Icons from "~/domain/data/Icons";
import Icon from "~/presentation/src/shared/components/Icon";

const PARTS: { label: TranslationKey; icon: Icons }[] = [
  { label: TranslationKeys.apps_welcome_hello, icon: Icons.handWave },
  { label: TranslationKeys.apps_welcome_about_me, icon: Icons.userSmile },
  { label: TranslationKeys.apps_welcome_technologies, icon: Icons.code },
  { label: TranslationKeys.apps_welcome_background, icon: Icons.article },
  { label: TranslationKeys.apps_welcome_completed, icon: Icons.check },
];

export enum Parts {
  Hello,
  AboutMe,
  Technologies,
  Background,
  Completed,
}

type Props = {
  part?: Parts;
};

export default function WelcomeWizardApp(props: Props) {
  const windowsService: IWindowsService = Container.instance.windowsService;

  const translate = useI18n();

  const [currentPart, setCurrentPart] = createSignal(props.part ?? Parts.Hello);
  const [isWarnedForConfirm, setIsWarnedForConfirm] = createSignal(false);
  const [isAboutConfirmed, setIsAboutConfirmed] = createSignal(props.part ? props.part > Parts.AboutMe : false);

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
            isConfirmedValue={isAboutConfirmed()}
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
      <header class="hidden basis-48 border-r border-surface-300 p-4 md:block">
        <Title class="text-xl">{translate(TranslationKeys.common_steps)}</Title>
        <NavMenu />
      </header>
      <div class="flex size-full flex-col overflow-hidden">
        <Show when={currentPart() < PARTS.length}>
          <main class="flex-grow overflow-auto">{getPartContent(currentPart())}</main>
        </Show>

        <footer class="mb-4 me-4 flex flex-row-reverse justify-start gap-2">
          <Button
            onClick={onNextPart}
            class="w-16"
            variant="primary"
            size="small"
            disabled={isWarnedForConfirm() && !isAboutConfirmed()}
            ariaLabel={
              currentPart() < PARTS.length - 1
                ? translate(TranslationKeys.common_next)
                : translate(TranslationKeys.apps_welcome_finish)
            }
          >
            {currentPart() < PARTS.length - 1
              ? translate(TranslationKeys.common_next)
              : translate(TranslationKeys.apps_welcome_finish)}
          </Button>
          <Button
            onClick={onPrevPart}
            class="w-16"
            variant="primary"
            disabled={currentPart() === 0}
            size="small"
            ariaLabel={translate(TranslationKeys.common_prev)}
          >
            {translate(TranslationKeys.common_prev)}
          </Button>
        </footer>
      </div>
    </div>
  );

  function NavMenu() {
    const [navItemHovered, setIsNavItemHovered] = createSignal<string | null>(null);

    function toggleNavItemHover(part: string | null = null) {
      setIsNavItemHovered(part);
    }

    return (
      <ul>
        <Index each={PARTS}>
          {(part, index) => (
            <li>
              <Button
                variant="text"
                class={mergeCls(
                  "duration-3000 w-full rounded text-left transition-colors duration-200 ease-in-out hover:bg-white hover:text-surface-500",
                  {
                    "bg-surface-400 font-bold": currentPart() === index,
                  },
                )}
                disabled={!isNextPartAvailable(index)}
                onClick={() => onPartClicked(index)}
                onMouseEnter={() => toggleNavItemHover(part().label)}
                onMouseLeave={() => toggleNavItemHover()}
                ariaLabel={translate(part().label)}
              >
                <span class="flex items-center gap-2">
                  <Icon
                    icon={part().icon}
                    class="size-4"
                    fillColor={navItemHovered() === part().label ? "black" : "white"}
                  />
                  {translate(part().label)}
                </span>
              </Button>
            </li>
          )}
        </Index>
      </ul>
    );
  }
}
