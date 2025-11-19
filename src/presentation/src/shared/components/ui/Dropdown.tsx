import { createMemo, createSignal, Index, createEffect, Show, type JSX } from "solid-js";
import CryptoExtensions from "@packages/acore-ts/crypto/CryptoExtensions";
import type { TranslationKey } from "@domain/data/Translations";
import { useI18n } from "@shared/utils/i18nTranslate";
import Button from "@shared/components/ui/Button";
import Link from "@shared/components/ui/Link";
import Icon from "@shared/components/Icon";
import type Icons from "@domain/data/Icons";
import Title from "@shared/components/ui/Title";

export type DropdownItem = {
  text: TranslationKey;
  icon?: Icons;
  href?: string;
  onClick?: () => void;
  items?: DropdownItem[];
};

type Props = {
  menuItems: DropdownItem[];
  children: JSX.Element;
  buttonClass?: string;
  ariaLabel: string;
};

export default function Dropdown(props: Props) {
  const translate = useI18n();

  const id = createMemo(() => CryptoExtensions.generateNanoId());
  const [isOpen, setIsOpen] = createSignal(false);

  createEffect(() => {
    if (isOpen()) document.addEventListener("click", onClickOutside);
    else document.removeEventListener("click", onClickOutside);
  });

  function onClickOutside(e: MouseEvent) {
    if (!isOpen()) return;
    const target = e.target as HTMLElement;
    if (!target.closest(`#${id()}`)) setIsOpen(false);
  }

  function onToggleDropdown() {
    setIsOpen(!isOpen());
  }

  return (
    <div id={id()} class="ac-dropdown relative inline-block text-left">
      <div class="flex size-full items-center justify-center">
        <Button
          type="button"
          onClick={onToggleDropdown}
          class={props.buttonClass}
          ariaLabel={props.ariaLabel}
          variant="primary"
        >
          {props.children}
        </Button>
      </div>

      <Show when={isOpen()}>
        <Menu />
      </Show>
    </div>
  );

  function Menu() {
    return (
      <div class="shadow-lg absolute left-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-surface-500 shadow-secondary ring-1 ring-black ring-opacity-5">
        <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <Index each={props.menuItems}>
            {(item) => {
              if (item().items)
                return (
                  <>
                    <Title class="border-b border-surface-300 px-4 py-2 text-xs text-gray-300">
                      {translate(item().text)}
                    </Title>
                    <Index each={item().items}>{(subitem) => <MenuItem item={subitem()} />}</Index>
                  </>
                );

              return <MenuItem item={item()} />;
            }}
          </Index>
        </div>
      </div>
    );
  }

  function MenuItem(props: { item: DropdownItem }) {
    const classes =
      "block px-4 py-2 text-sm text-gray-200 hover:bg-gray-100 hover:text-gray-900 w-full text-start border-none shadow-none cursor-pointer rounded transition-colors duration-200 ease-in-out";

    function onClick() {
      setIsOpen(false);
      props.item.onClick?.();
    }

    if (props.item.href)
      return (
        <Link
          href={props.item.href}
          onClick={onClick}
          class={classes}
          variant="link"
          ariaLabel={translate(props.item.text)}
        >
          {renderMenuItem(props.item)}
        </Link>
      );
    else
      return (
        <Button onClick={onClick} class={classes} variant="link" ariaLabel={translate(props.item.text)}>
          {renderMenuItem(props.item)}
        </Button>
      );

    function renderMenuItem(item: DropdownItem) {
      return (
        <span class="flex items-center gap-2">
          <Show when={item.icon}>
            <Icon icon={item.icon!} class="size-3" />
          </Show>
          {translate(item.text)}
        </span>
      );
    }
  }
}
