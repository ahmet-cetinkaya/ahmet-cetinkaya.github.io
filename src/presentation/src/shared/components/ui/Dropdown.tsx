import { createMemo, createSignal, Index, onCleanup, onMount, type JSX } from "solid-js";
import { CryptoExtensions } from "~/core/acore-ts/crypto/CryptoExtensions";
import type { TranslationKey } from "~/domain/data/Translations";
import useI18n from "../../utils/i18nTranslate";
import Button from "./Button";
import Link from "./Link";

export interface DropdownItem {
  text: TranslationKey;
  href?: string;
  onClick?: () => void;
  items?: DropdownItem[];
}
interface Props {
  menuItems: DropdownItem[];
  children: JSX.Element;
}
export default function Dropdown(props: Props) {
  const id = createMemo(() => CryptoExtensions.generateNanoId());
  const translate = useI18n();

  const [isOpen, setIsOpen] = createSignal(false);

  onMount(() => {
    document.addEventListener("click", (e) => onClickOutside(e));
  });

  onCleanup(() => {
    document.removeEventListener("click", (e) => onClickOutside(e));
  });

  function onClickOutside(e: MouseEvent) {
    if (!isOpen()) return;
    const target = e.target as HTMLElement;
    if (!target.closest(`#${id()}`)) setIsOpen(false);
  }

  function onToggle() {
    setIsOpen(!isOpen());
  }

  return (
    <div id={id()} class="ac-dropdown relative inline-block text-left">
      <div class="flex size-full items-center justify-center">
        <Button type="button" onClick={onToggle}>
          {props.children}
        </Button>
      </div>

      {isOpen() && (
        <div class="absolute left-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <Index each={props.menuItems}>
              {(item) => {
                if (item().items)
                  return (
                    <>
                      <h1 class="ms-2 p-2 text-xs text-gray-600">{translate(item().text)}</h1>
                      <hr />
                      <Index each={item().items}>{(subitem) => <MenuItem item={subitem()} />}</Index>
                    </>
                  );

                return <MenuItem item={item()} />;
              }}
            </Index>
          </div>
        </div>
      )}
    </div>
  );
}

//#region MenuItem
interface MenuItemProps {
  item: DropdownItem;
}

function MenuItem(props: MenuItemProps) {
  const translate = useI18n();

  const className =
    "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-start border-none shadow-none cursor-pointer";
  if (props.item.href)
    return (
      <Link href={props.item.href} onClick={props.item.onClick} class={className} variant="link">
        {translate(props.item.text)}
      </Link>
    );
  else
    return (
      <Button onClick={props.item.onClick} class={className} variant="link">
        {translate(props.item.text)}
      </Button>
    );
}
//#endregion
