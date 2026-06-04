import { createSignal } from "solid-js";
import type { DialogConfig } from "../components/dialogs";

export interface UseFileExplorerDialogsReturn {
  openDialog: (config: DialogConfig) => void;
  closeDialog: () => void;
  currentDialog: () => DialogConfig | null;
}

export const useFileExplorerDialogs = (): UseFileExplorerDialogsReturn => {
  const [currentDialog, setCurrentDialog] = createSignal<DialogConfig | null>(null);

  const openDialog = (config: DialogConfig) => {
    setCurrentDialog(config);
  };

  const closeDialog = () => {
    setCurrentDialog(null);
  };

  return {
    openDialog,
    closeDialog,
    currentDialog,
  };
};
