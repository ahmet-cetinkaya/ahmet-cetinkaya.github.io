import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";

export async function pathExists(fileSystemService: IFileSystemService, path: string): Promise<boolean> {
  if (path === "/") return true;
  const entry = await fileSystemService.get((e) => e.fullPath === path);
  return Boolean(entry);
}
