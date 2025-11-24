import ConfirmDialog from "@shared/components/ui/ConfirmDialog";
import Icons from "@domain/data/Icons";
import type { BaseDialogProps } from "./BaseFileExplorerDialog";
import { FileExplorerDialogService } from "../../services/FileExplorerDialogService";

export type DeleteDialogProps = BaseDialogProps & {
  pathsToDelete: string[];
  dialogService: FileExplorerDialogService;
};

export default function DeleteDialog(props: DeleteDialogProps) {
  const itemCount = props.pathsToDelete.length;
  const fileNames = props.pathsToDelete.map((path) => path.split("/").pop() || "unknown");

  const confirmMessage = `Are you sure delete the ${itemCount === 1 ? `"${fileNames[0]}"?` : `these ${itemCount} items?`}`;

  const fileListDisplay =
    props.pathsToDelete.length <= 5
      ? fileNames.join(", ")
      : `${fileNames.slice(0, 3).join(", ")} and ${itemCount - 3} more...`;

  return (
    <ConfirmDialog
      isOpen={props.isOpen}
      title="Confirm Delete"
      message={confirmMessage}
      description={fileListDisplay}
      type="danger"
      icon={Icons.trash}
      confirmButtonText="OK"
      cancelButtonText="Cancel"
      onConfirm={async () => {
        await props.dialogService.deleteEntries(props.pathsToDelete, {
          onSuccess: () => {
            props.onSuccess?.();
            props.onClose();
          },
          onError: props.onError,
        });
      }}
      onCancel={() => {
        props.onClose();
      }}
    />
  );
}
