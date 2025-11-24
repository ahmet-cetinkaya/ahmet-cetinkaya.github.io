import { For, createSignal, Show, createMemo } from "solid-js";
import Icon from "@shared/components/Icon";
import Icons from "@domain/data/Icons";
import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";

type FileExplorerBreadcrumbProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
};

interface BreadcrumbItem {
  name: string;
  path: string;
  isRoot: boolean;
}

export default function FileExplorerBreadcrumb(props: FileExplorerBreadcrumbProps) {
  const [isEditing, setIsEditing] = createSignal(false);
  const [editPath, setEditPath] = createSignal(props.currentPath);

  // Generate breadcrumb items from current path - memoized to prevent unnecessary recalculations
  const breadcrumbItems = createMemo(() => {
    const items: BreadcrumbItem[] = [];
    const parts = props.currentPath.split("/").filter(Boolean);

    // Root item
    items.push({
      name: "Root",
      path: "/",
      isRoot: true,
    });

    // Build path items
    let currentPath = "";
    for (const part of parts) {
      currentPath += `/${part}`;
      items.push({
        name: part,
        path: currentPath,
        isRoot: false,
      });
    }

    return items;
  });

  function handleBreadcrumbClick(path: string) {
    if (path !== props.currentPath) {
      props.onNavigate(path);
    }
  }

  function handlePathEdit() {
    setEditPath(props.currentPath);
    setIsEditing(true);
  }

  function handlePathSubmit(e: KeyboardEvent) {
    if (e.key === "Enter") {
      const newPath = editPath().trim();
      if (newPath && newPath !== props.currentPath) {
        props.onNavigate(newPath);
      }
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditPath(props.currentPath);
    }
  }

  function handlePathBlur() {
    setIsEditing(false);
    setEditPath(props.currentPath);
  }

  return (
    <div class="flex h-10 min-h-[2.5rem] items-center p-2">
      <Show
        when={isEditing()}
        fallback={
          <nav class="flex items-center space-x-1 text-sm" aria-label="Breadcrumb">
            <For each={breadcrumbItems()}>
              {(item, index) => (
                <>
                  <Show when={index() > 0}>
                    <span class="mx-1 text-gray-400">/</span>
                  </Show>
                  <button
                    type="button"
                    class={mergeCls(
                      "rounded px-2 py-1 transition-colors duration-200",
                      item.path === props.currentPath
                        ? "bg-surface-300 text-white"
                        : "text-gray-300 hover:bg-surface-400 hover:text-white",
                    )}
                    onClick={() => handleBreadcrumbClick(item.path)}
                    onDblClick={() => item.path === props.currentPath && handlePathEdit()}
                    aria-current={item.path === props.currentPath ? "page" : undefined}
                    title={item.path === props.currentPath ? "Double-click to edit path" : undefined}
                  >
                    {item.isRoot ? <Icon icon={Icons.computer} class="h-4 w-4" /> : item.name}
                  </button>
                </>
              )}
            </For>
          </nav>
        }
      >
        {/* Path editing input */}
        <input
          type="text"
          class="h-6 w-full rounded bg-surface-300 px-2 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={editPath()}
          onInput={(e) => setEditPath(e.currentTarget.value)}
          onKeyDown={handlePathSubmit}
          onBlur={handlePathBlur}
          placeholder="Enter path..."
          aria-label="Edit path"
          ref={(el) => el?.focus()}
        />
      </Show>
    </div>
  );
}
