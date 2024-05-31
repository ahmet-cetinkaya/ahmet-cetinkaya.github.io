import type { JSX } from 'solid-js/jsx-runtime';
import { twMerge } from 'tailwind-merge';
import { buttonVariantClassNames } from './Button';

const linkVariantClassNames = {
  ...buttonVariantClassNames,
};

type LinkVariant = keyof typeof linkVariantClassNames;
interface Props {
  href: string;
  onClick?: (e: MouseEvent) => void;
  children: JSX.Element;
  variant?: LinkVariant;
  className?: string;
}

export default function Link({ href, onClick, children, variant = 'primary', className }: Props) {
  return (
    <a href={href} onClick={onClick} class={twMerge(linkVariantClassNames[variant], className)}>
      {children}
    </a>
  );
}
