import {
  FileViewMode,
  FileSortCriteria,
  SortOrder,
} from "@application/features/fileExplorer/services/FileExplorerService";
import Icon from "@shared/components/Icon";
import Icons from "@domain/data/Icons";
import Button from "@shared/components/ui/Button";
import Dropdown from "@shared/components/ui/Dropdown";
import { TranslationKeys } from "@domain/data/Translations";
import FileExplorerBreadcrumb from "./FileExplorerBreadcrumb";

type FileExplorerToolbarProps = {
  currentPath: string;
  breadcrumbPath: string;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onNavigate: (path: string) => void;
  onCreateFolder: () => void;
  onCreateFile: () => void;
  onViewModeChange: (mode: FileViewMode) => void;
  currentViewMode: FileViewMode;
  onSortChange: (sortBy: FileSortCriteria) => void;
  currentSortBy: FileSortCriteria;
  currentSortOrder: SortOrder;
};

export default function FileExplorerToolbar(props: FileExplorerToolbarProps) {
  const createMenuItems = () => [
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

  const optionsMenuItems = () => [
    {
      text: TranslationKeys.apps_file_explorer_view_options,
      items: [
        {
          text: TranslationKeys.apps_file_explorer_view_grid,
          icon: props.currentViewMode === FileViewMode.GRID ? Icons.check : Icons.spinner,
          onClick: () => props.onViewModeChange(FileViewMode.GRID),
        },
        {
          text: TranslationKeys.apps_file_explorer_view_list,
          icon: props.currentViewMode === FileViewMode.LIST ? Icons.check : Icons.unorderedList,
          onClick: () => props.onViewModeChange(FileViewMode.LIST),
        },
      ],
    },
    {
      text: TranslationKeys.apps_file_explorer_sort_options,
      items: [
        {
          text: TranslationKeys.apps_file_explorer_sort_by_name,
          icon:
            props.currentSortBy === FileSortCriteria.NAME
              ? props.currentSortOrder === SortOrder.ASC
                ? Icons.upArrow
                : Icons.downArrow
              : Icons.center,
          onClick: () => props.onSortChange(FileSortCriteria.NAME),
        },
        {
          text: TranslationKeys.apps_file_explorer_sort_by_size,
          icon:
            props.currentSortBy === FileSortCriteria.SIZE
              ? props.currentSortOrder === SortOrder.ASC
                ? Icons.upArrow
                : Icons.downArrow
              : Icons.center,
          onClick: () => props.onSortChange(FileSortCriteria.SIZE),
        },
        {
          text: TranslationKeys.apps_file_explorer_sort_by_modified,
          icon:
            props.currentSortBy === FileSortCriteria.MODIFIED
              ? props.currentSortOrder === SortOrder.ASC
                ? Icons.upArrow
                : Icons.downArrow
              : Icons.center,
          onClick: () => props.onSortChange(FileSortCriteria.MODIFIED),
        },
        {
          text: TranslationKeys.apps_file_explorer_sort_by_type,
          icon:
            props.currentSortBy === FileSortCriteria.TYPE
              ? props.currentSortOrder === SortOrder.ASC
                ? Icons.upArrow
                : Icons.downArrow
              : Icons.center,
          onClick: () => props.onSortChange(FileSortCriteria.TYPE),
        },
      ],
    },
  ];

  return (
    <div class="relative flex items-center justify-between border-b border-surface-300 bg-surface-500 p-2">
      {/* Navigation Controls */}
      <div class="flex items-center space-x-1">
        <Button
          variant="primary"
          size="small"
          ariaLabel="Navigate back"
          onClick={props.onGoBack}
          disabled={!props.canGoBack()}
          class="p-2"
        >
          <Icon icon={Icons.leftArrow} class="h-4 w-4" />
        </Button>

        <Button
          variant="primary"
          size="small"
          ariaLabel="Navigate forward"
          onClick={props.onGoForward}
          disabled={!props.canGoForward()}
          class="p-2"
        >
          <Icon icon={Icons.rightArrow} class="h-4 w-4" />
        </Button>
      </div>

      {/* Breadcrumb Navigation */}
      <div class="mx-4 flex flex-1 items-center justify-center">
        <FileExplorerBreadcrumb currentPath={props.breadcrumbPath} onNavigate={props.onNavigate} />
      </div>

      {/* Action Controls */}
      <div class="flex items-center space-x-1">
        <Dropdown menuItems={createMenuItems()} ariaLabel="Create new file or folder" buttonClass="p-2">
          <Icon icon={Icons.plus} class="h-4 w-4" />
        </Dropdown>

        <Dropdown menuItems={optionsMenuItems()} ariaLabel="View and sort options" buttonClass="p-2">
          <Icon icon={Icons.orderedList} class="h-4 w-4" />
        </Dropdown>
      </div>
    </div>
  );
}
