import { createMemo, createSignal, Index, createEffect, Show, type Accessor, type JSX } from "solid-js";
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
  isSelected?: Accessor<boolean> | boolean;
  onClick?: () => void;
  items?: DropdownItem[];
};

type Props = {
  menuItems: DropdownItem[];
  children: JSX.Element;
  buttonClass?: string;
  ariaLabel: string;
  closeOnItemClick?: boolean;
};

export default function Dropdown(dropdownProps: Props) {
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
          class={dropdownProps.buttonClass}
          ariaLabel={dropdownProps.ariaLabel}
          variant="primary"
        >
          {dropdownProps.children}
        </Button>
      </div>

      <Show when={isOpen()}>
        <Menu />
      </Show>
    </div>
  );

  function Menu() {
    return (
      <div class="bg-surface-500 shadow-secondary ring-opacity-5 absolute top-full right-0 z-[9999] mt-1 max-h-96 w-56 origin-top-right overflow-y-auto rounded-md shadow-md ring-1 ring-black">
        <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <Index each={dropdownProps.menuItems}>
            {(item) => {
              if (item().items)
                return (
                  <>
                    <Title class="border-surface-300 bg-surface-500 sticky top-0 border-b px-4 py-2 text-xs text-gray-300">
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

  function MenuItem(menuItemProps: { item: DropdownItem }) {
    const isSelected = () => {
      const selectedState = menuItemProps.item.isSelected;
      return typeof selectedState === "function" ? selectedState() : Boolean(selectedState);
    };

    const classes = () =>
      isSelected()
        ? "mx-2 my-0.5 block w-[calc(100%-1rem)] cursor-pointer rounded border-none bg-surface-300 px-4 py-2 text-start text-sm !text-gray-100 shadow-none transition-colors duration-200 ease-in-out hover:!text-gray-100"
        : "mx-2 my-0.5 block w-[calc(100%-1rem)] cursor-pointer rounded border-none px-4 py-2 text-start text-sm text-gray-200 shadow-none transition-colors duration-200 ease-in-out hover:bg-surface-300 hover:text-gray-200";

    function onClick() {
      if (dropdownProps.closeOnItemClick ?? true) {
        setIsOpen(false);
      }
      menuItemProps.item.onClick?.();
    }

    function onAnchorClick(event: MouseEvent) {
      if (menuItemProps.item.onClick) event.preventDefault();
      onClick();
    }

    if (menuItemProps.item.href)
      return (
        <Link
          href={menuItemProps.item.href}
          onClick={onAnchorClick}
          class={classes()}
          variant="unstyled"
          ariaLabel={translate(menuItemProps.item.text)}
        >
          {renderMenuItem(menuItemProps.item)}
        </Link>
      );
    else
      return (
        <Button onClick={onClick} class={classes()} variant="unstyled" ariaLabel={translate(menuItemProps.item.text)}>
          {renderMenuItem(menuItemProps.item)}
        </Button>
      );

    function renderMenuItem(item: DropdownItem) {
      return (
        <span class="flex items-center gap-2">
          <span class="flex w-3 shrink-0 justify-center">
            <Show when={item.icon}>
              <Icon icon={item.icon!} class="size-3" preserveFill={true} />
            </Show>
          </span>
          <span>{translate(item.text)}</span>
        </span>
      );
    }
  }
}
