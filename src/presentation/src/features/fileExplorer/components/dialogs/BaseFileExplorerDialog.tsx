import Icons from "@domain/data/Icons";

export type BaseDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export type InputDialogProps = BaseDialogProps & {
  title: string;
  message: string;
  placeholder: string;
  defaultValue: string;
  icon: Icons;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: (value: string) => Promise<boolean> | void | Promise<void>;
  errorMessage?: string;
};

export type ConfirmDialogProps = BaseDialogProps & {
  title: string;
  message: string;
  description?: string;
  icon?: Icons;
  type?: "info" | "warning" | "danger";
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => Promise<void> | void;
};
