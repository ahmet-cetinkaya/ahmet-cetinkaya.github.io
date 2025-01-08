import { mergeCls } from "~/presentation/src/core/acore-ts/ui/ClassHelpers";

type Props = {
  id?: string;
  value: string;
  onInputChange?: (value: string) => void;
  class?: string;
  type?: "text" | "password" | "email" | "number";
  disabled?: boolean;
};

export default function Input(props: Props) {
  if (props.type === undefined) props.type = "text";
  if (props.disabled === undefined) props.disabled = false;

  function onInput(e: Event) {
    if (!props.onInputChange) return;

    const newValue = (e.target as HTMLInputElement).value;
    props.onInputChange(newValue);
  }

  return (
    <input
      id={props.id}
      type={props.type}
      value={props.value}
      onInput={onInput}
      class={mergeCls(
        "w-full rounded-md border border-black bg-surface-400 p-2 shadow-primary focus:outline-none focus:ring-2 focus:ring-blue-500",
        props.class,
      )}
      disabled={props.disabled}
    />
  );
}
