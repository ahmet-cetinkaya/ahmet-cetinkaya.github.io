import type { BaseDialogProps } from "./BaseFileExplorerDialog";

type DialogCallbacks = {
  onSuccess: () => void;
  onError: (error: unknown) => void;
};

export function executeDialogAction(
  action: (callbacks: DialogCallbacks) => void,
  props: Pick<BaseDialogProps, "onSuccess" | "onClose" | "onError">,
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    action({
      onSuccess: () => {
        props.onSuccess?.();
        props.onClose();
        resolve(true);
      },
      onError: (error) => {
        props.onError?.(error);
        resolve(false);
      },
    });
  });
}
