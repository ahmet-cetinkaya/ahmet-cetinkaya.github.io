import MarkdownParser, { type MarkdownOptions } from "~/core/acore-ts/ui/MarkdownParser";

type Props = {
  content: string;
  class?: string;
  options?: MarkdownOptions;
};

const defaultMarkdownOptions: Props = {
  content: undefined!,
  options: {
    header1: { class: "text-4xl font-bold" },
    header2: { class: "text-3xl font-bold" },
    header3: { class: "text-2xl font-bold" },
    header4: { class: "text-xl font-bold" },
    header5: { class: "text-lg font-bold" },
    header6: { class: "text-base font-bold" },
    bold: { class: "font-bold" },
    italic: { class: "italic" },
    unorderedList: { class: "list-disc ml-4" },
    orderedList: { class: "list-decimal ml-4" },
    listItem: { class: "mb-2" },
    image: { class: "w-full" },
    link: { class: "text-blue-500 underline" },
    blockquote: { class: "border-l-4 border-gray-500 pl-4" },
    table: { class: "w-full" },
    tableRow: { class: "border-b" },
    tableHeader: { class: "text-left" },
    tableCell: { class: "p-2" },
    codeBlock: { class: "bg-gray-100 p-2 rounded-md" },
    inlineCode: { class: "bg-gray-100 p-1 rounded-md" },
  }
};

export default function MarkdownParagraph(props: Props) {
  props.options = { ...defaultMarkdownOptions, ...props.options };

  return <article innerHTML={MarkdownParser.parse(props.content, props.options)} class={props.class} />;
}
