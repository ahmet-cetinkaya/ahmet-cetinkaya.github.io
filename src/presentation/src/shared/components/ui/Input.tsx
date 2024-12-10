import { createSignal } from "solid-js";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";

type InputProps = {
  id?: string;
  value?: string;
  onInputChange?: (value: string) => void;
  class?: string;
  type?: "text" | "password" | "email" | "number";
  disabled?: boolean;
};

export default function Input(props: InputProps) {
  if (props.type === undefined) props.type = "text";
  if (props.disabled === undefined) props.disabled = false;

  const [value, setValue] = createSignal(props.value || "");

  function onInput(e: Event) {
    const newValue = (e.target as HTMLInputElement).value;
    setValue(newValue);
    if (props.onInputChange) {
      props.onInputChange(newValue);
    }
  }

  return (
    <input
      id={props.id}
      type={props.type}
      value={value()}
      onInput={onInput}
      class={mergeCls(
        "w-full rounded-md border border-black bg-surface-400 p-2 shadow-primary focus:outline-none focus:ring-2 focus:ring-blue-500",
        props.class,
      )}
      disabled={props.disabled}
    />
  );
}
