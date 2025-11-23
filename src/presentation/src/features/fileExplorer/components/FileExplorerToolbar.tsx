import {
  FileViewMode,
  FileSortCriteria,
  SortOrder,
} from "@application/features/fileExplorer/services/FileExplorerService";
import Icon from "@shared/components/Icon";
import Icons from "@domain/data/Icons";
import Button from "@shared/components/ui/Button";
import Dropdown, { type DropdownItem } from "@shared/components/ui/Dropdown";
import { TranslationKeys } from "@domain/data/Translations";

type Props = {
  currentPath: string;
  viewMode: FileViewMode;
  sortBy: FileSortCriteria;
  sortOrder: SortOrder;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  onNavigateUp: () => void;
  onRefresh: () => void;
  onViewModeChange: (mode: FileViewMode) => void;
  onSortChange: (sortBy: FileSortCriteria, sortOrder: SortOrder) => void;
  onCreateFolder: () => void;
  onCreateFile: () => void;
  onListOptions: () => void;
  canNavigateBack?: boolean;
  canNavigateForward?: boolean;
};

export default function FileExplorerToolbar(props: Props) {
  const createMenuItems: DropdownItem[] = [
    {
      text: TranslationKeys.common_new_folder,
      icon: Icons.folderPlus,
      onClick: props.onCreateFolder,
    },
    {
      text: TranslationKeys.common_new_file,
      icon: Icons.filePlus,
      onClick: props.onCreateFile,
    },
  ];

  return (
    <div class="flex items-center justify-between border-b border-surface-300 bg-surface-500 p-2">
      {/* BACK_ICON | FORWARD_ICON */}
      <div class="flex items-center space-x-1">
        <Button
          variant="text"
          size="small"
          ariaLabel="Navigate back"
          onClick={props.onNavigateBack}
          disabled={props.canNavigateBack === false}
          class="p-2"
        >
          <Icon icon={Icons.leftArrow} class="h-4 w-4" />
        </Button>

        <Button
          variant="text"
          size="small"
          ariaLabel="Navigate forward"
          onClick={props.onNavigateForward}
          disabled={props.canNavigateForward === false}
          class="p-2"
        >
          <Icon icon={Icons.rightArrow} class="h-4 w-4" />
        </Button>
      </div>

      {/* BREADCRUMB - This will be handled by the Breadcrumb component, so we'll leave space for it */}
      <div class="flex flex-1 items-center">{/* Breadcrumb will be rendered separately in FileExplorerApp */}</div>

      {/* CREATE_BUTTON (Dropdown) | LIST_OPTIONS_ICON */}
      <div class="flex items-center space-x-1">
        <Dropdown menuItems={createMenuItems} ariaLabel="Create new file or folder" buttonClass="p-2">
          <Icon icon={Icons.plus} class="h-4 w-4" />
        </Dropdown>

        <Button variant="text" size="small" ariaLabel="List options" onClick={props.onListOptions} class="p-2">
          <Icon icon={Icons.orderedList} class="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
