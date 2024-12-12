import type { JSX } from "solid-js/jsx-runtime";

type Props = {
  src: string;
  alt: string;
  srcset?: string;
  sizes?: string;
  width?: number | string;
  height?: number | string;
  loading?: "lazy" | "eager";
  decoding?: "auto" | "async" | "sync";
  isExternal?: boolean;
  class?: string;
  style?: JSX.CSSProperties;
};

export default function Image(props: Props) {
  if (!props.loading) props.loading = "lazy";
  if (!props.decoding) props.decoding = "async";

  return (
    <img
      src={props.src}
      srcset={props.srcset}
      height={props.height}
      width={props.width}
      class={props.class}
      sizes={props.sizes}
      loading={props.loading}
      decoding={props.decoding}
      alt={props.alt}
      crossorigin={props.isExternal ? "anonymous" : undefined}
      referrerpolicy={props.isExternal ? "no-referrer" : undefined}
      style={props.style}
    />
  );
}
