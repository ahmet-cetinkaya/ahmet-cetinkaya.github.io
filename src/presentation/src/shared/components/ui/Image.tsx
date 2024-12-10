import { createEffect, createSignal } from "solid-js";

type Props = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  sizes?: string;
  srcset?: string;
  loading?: "lazy" | "eager";
  decoding?: "auto" | "async" | "sync";
};

export default function Image(props: Props) {
  const [image, setImage] = createSignal<{
    src: string;
    attributes: {
      sizes?: string;
      srcset?: string;
      loading: "lazy" | "eager";
      decoding: "auto" | "async" | "sync";
      alt: string;
    };
  } | null>(null);

  createEffect(() => {
    if (!props.alt) {
      throw new Error("Alt attribute is required");
    }

    const width = typeof props.width === "string" ? parseInt(props.width) : props.width;
    const height = typeof props.height === "string" ? parseInt(props.height) : props.height;
    const loading = props.loading && ["lazy", "eager"].includes(props.loading) ? props.loading : "lazy";
    const decoding = props.decoding && ["auto", "async", "sync"].includes(props.decoding) ? props.decoding : "async";

    setImage({
      src: props.src,
      width,
      height,
      attributes: {
        sizes: props.sizes,
        srcset: props.srcset,
        loading,
        decoding,
        alt: props.alt,
      },
    });
  });

  return (
    <>
      {image() && (
        <img
          src={image()!.src}
          height={props.height}
          width={props.width}
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
          {...image()!.attributes}
        />
      )}
    </>
  );
}
