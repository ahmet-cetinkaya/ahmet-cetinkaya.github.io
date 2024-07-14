import type { JSX } from 'solid-js/jsx-runtime';
import { twMerge } from 'tailwind-merge';
import { buttonVariantClassNames } from './Button';

const linkVariantClassNames = {
  ...buttonVariantClassNames,
};

type LinkVariant = keyof typeof linkVariantClassNames;
interface Props {
  href: string;
  children: JSX.Element;
  draggable?: boolean;
  variant?: LinkVariant;
  class?: string;
  onClick?: (e: MouseEvent) => void;
  onDragStart?: (e: DragEvent) => void;
}

export default function Link({ href, children, variant = 'primary', class: className, onClick, onDragStart }: Props) {
  return (
    <a
      href={href}
      class={twMerge(linkVariantClassNames[variant], className)}
      onClick={onClick}
      onDragStart={onDragStart}
    >
      {children}
    </a>
  );
}
