import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";

export function formatFileSize(size: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;
  let value = size;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getValidModifiedDate(entry: FileSystemEntry): Date {
  if (entry.updatedDate) {
    const minValidDate = new Date("1970-01-01");
    if (entry.updatedDate >= minValidDate) {
      return entry.updatedDate;
    }
  }
  return entry.createdDate;
}
