import { createMemo, createSignal, onCleanup, onMount, type JSX } from "solid-js";
import { CryptoExtensions } from "~/core/acore-ts/crypto/CryptoExtensions";
import Button from "./Button";
import Link from "./Link";

export interface DropdownItem {
  text: string;
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
      <Button type="button" onClick={onToggle}>
        {props.children}
      </Button>

      {isOpen() && (
        <div class="absolute left-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {props.menuItems.map((item) => {
              if (item.items)
                return (
                  <>
                    <h1 class="ms-2 p-2 text-xs text-gray-600">{item.text}</h1>
                    <hr />
                    {item.items.map((subitem) => (
                      <MenuItem item={subitem} />
                    ))}
                  </>
                );

              return <MenuItem item={item} />;
            })}
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

function MenuItem({ item }: MenuItemProps) {
  const className =
    "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-start border-none shadow-none cursor-pointer";
  if (item.href)
    return (
      <Link href={item.href} onClick={item.onClick} class={className} variant="link">
        {item.text}
      </Link>
    );
  else
    return (
      <Button onClick={item.onClick} className={className} variant="link">
        {item.text}
      </Button>
    );
}
//#endregion
