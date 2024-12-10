import { createMemo, createSignal, Index, onCleanup, onMount, Show, type JSX } from "solid-js";
import { CryptoExtensions } from "~/core/acore-ts/crypto/CryptoExtensions";
import type { TranslationKey } from "~/domain/data/Translations";
import useI18n from "../../utils/i18nTranslate";
import Button from "./Button";
import Link from "./Link";
import Icon from "../Icon";
import type { Icons } from "~/domain/data/Icons";

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
};

export default function Dropdown(props: Props) {
  const id = createMemo(() => CryptoExtensions.generateNanoId());
  const translate = useI18n();

  const [isOpen, setIsOpen] = createSignal(false);

  onMount(() => {
    addEventListeners();
  });

  function addEventListeners() {
    document.addEventListener("click", onClickOutside);

    onCleanup(() => {
      document.removeEventListener("click", onClickOutside);
    });
  }

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
        <Button type="button" onClick={onToggleDropdown} class={props.buttonClass}>
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
                    <h1 class="border-b border-surface-300 px-4 py-2 text-xs text-gray-300">
                      {translate(item().text)}
                    </h1>
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
      "block px-4 py-2 text-sm text-gray-200 hover:bg-gray-100 hover:text-gray-900 w-full text-start border-none shadow-none cursor-pointer rounded";

    function onClick() {
      setIsOpen(false);
      props.item.onClick?.();
    }

    if (props.item.href)
      return (
        <Link href={props.item.href} onClick={onClick} class={classes} variant="link">
          {renderMenuItem(props.item)}
        </Link>
      );
    else
      return (
        <Button onClick={onClick} class={classes} variant="link">
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
