export default class PathUtils {
  static normalize(currentPath: string, inputPath?: string): string {
    if (!inputPath) return currentPath;

    const actualPath = inputPath.trim().split(/\s+/).pop() || "";
    const targetPath = !actualPath.startsWith("/") ? `${currentPath}/${actualPath}` : actualPath;
    const parts = targetPath.split("/").filter(Boolean);
    const normalizedParts: string[] = [];

    for (const part of parts) {
      if (part === "..") normalizedParts.pop();
      else if (part !== ".") normalizedParts.push(part);
    }

    return `/${normalizedParts.join("/")}`;
  }

  static relative(currentPath: string, targetPath: string): string {
    const currentParts = currentPath.split("/").filter(Boolean);
    const targetParts = targetPath.split("/").filter(Boolean);

    let i = 0;
    while (i < currentParts.length && i < targetParts.length && currentParts[i] === targetParts[i]) ++i;

    const remainingParts = currentParts.slice(i);
    const upLevels = remainingParts.map(() => "..");
    const downLevels = targetParts.slice(i);

    return [...upLevels, ...downLevels].join("/");
  }

  static basename(fullPath: string) {
    return fullPath.split("/").filter(Boolean).pop() || "";
  }
}
