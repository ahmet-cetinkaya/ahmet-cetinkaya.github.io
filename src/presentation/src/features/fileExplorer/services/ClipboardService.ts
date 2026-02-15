import { logger } from "@shared/utils/logger";

export interface ClipboardItem {
  path: string;
  name: string;
  isDirectory: boolean;
  originalPath: string; // For cut operations
}

export interface ClipboardData {
  items: ClipboardItem[];
  operation: "copy" | "cut";
  sourcePath: string; // The directory where items were copied/cut from
}

export class ClipboardService {
  private static instance: ClipboardService;
  private clipboard: ClipboardData | null = null;

  static getInstance(): ClipboardService {
    if (!ClipboardService.instance) {
      ClipboardService.instance = new ClipboardService();
    }
    return ClipboardService.instance;
  }

  // Store items in clipboard for copy operation
  copy(items: ClipboardItem[], sourcePath: string): void {
    this.clipboard = {
      items: [...items],
      operation: "copy",
      sourcePath,
    };
    logger.clipboard("copy", items.length);
  }

  // Store items in clipboard for cut operation
  cut(items: ClipboardItem[], sourcePath: string): void {
    this.clipboard = {
      items: [...items],
      operation: "cut",
      sourcePath,
    };
    logger.clipboard("cut", items.length);
  }

  // Get clipboard contents
  getClipboard(): ClipboardData | null {
    return this.clipboard;
  }

  // Check if clipboard has pasteable content
  canPaste(targetPath: string): boolean {
    if (!this.clipboard) return false;

    // Don't allow pasting in the same directory for cut operations
    if (this.clipboard.operation === "cut" && this.clipboard.sourcePath === targetPath) {
      return false;
    }

    return this.clipboard.items.length > 0;
  }

  // Clear clipboard
  clear(): void {
    this.clipboard = null;
    logger.clipboard("clear");
  }

  // Check if clipboard has cut operation (used to know if we should delete source after paste)
  isCutOperation(): boolean {
    return this.clipboard?.operation === "cut";
  }

  // Get items for paste operation
  getItemsForPaste(): ClipboardItem[] {
    return this.clipboard?.items || [];
  }

  // Mark cut operation as completed (clears clipboard after successful paste)
  completeCutOperation(): void {
    if (this.clipboard?.operation === "cut") {
      this.clear();
    }
  }
}

// Export singleton instance
export default ClipboardService.getInstance();
