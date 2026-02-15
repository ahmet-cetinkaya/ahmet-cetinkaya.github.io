import { createMemo } from "solid-js";

type WindowsStyleTitleProps = {
  text: string;
  class?: string;
  maxLength?: number;
  wrap?: boolean;
};

export default function WindowsStyleTitle(props: WindowsStyleTitleProps) {
  const truncatedText = createMemo(() => {
    const { text } = props;
    const maxLength = props.maxLength || 20;

    if (text.length <= maxLength) {
      return text;
    }

    // Windows-style: Keep beginning and end, truncate middle with ellipsis
    const startLength = Math.ceil(maxLength / 2) - 1;
    const endLength = Math.floor(maxLength / 2) - 1;

    return `${text.substring(0, startLength)}...${text.substring(text.length - endLength)}`;
  });

  return (
    <span
      class={props.class}
      title={props.text}
      style={
        props.wrap
          ? "overflow: hidden; word-wrap: break-word; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;"
          : "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
      }
    >
      {truncatedText()}
    </span>
  );
}
