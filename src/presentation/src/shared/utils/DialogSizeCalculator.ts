import Size from "@packages/acore-ts/ui/models/Size";

export interface DialogSizingOptions {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  padding?: number;
  enableAutoResize?: boolean;
}

export interface ContentMetrics {
  textLength: number;
  hasInput: boolean;
  hasButtons: boolean;
  hasError: boolean;
  lineCount: number;
  hasIcon: boolean;
}

export default class DialogSizeCalculator {
  private static readonly DEFAULT_OPTIONS: Required<DialogSizingOptions> = {
    minWidth: 280,
    maxWidth: 600,
    minHeight: 120,
    maxHeight: 500,
    padding: 16,
    enableAutoResize: true,
  };

  /**
   * Calculate optimal dialog size based on content characteristics
   */
  static calculateOptimalSize(contentMetrics: ContentMetrics, options: DialogSizingOptions = {}): Size {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    if (!opts.enableAutoResize) {
      return new Size(400, 200);
    }

    // Base calculations
    const width = this.calculateWidth(contentMetrics, opts);
    const height = this.calculateHeight(contentMetrics, opts);

    return new Size(width, height);
  }

  /**
   * Analyze content to extract metrics for size calculation
   */
  static analyzeContent(
    message?: string,
    hasInput: boolean = false,
    hasButtons: boolean = true,
    hasError: boolean = false,
    hasIcon: boolean = false,
  ): ContentMetrics {
    return {
      textLength: message?.length || 0,
      hasInput,
      hasButtons,
      hasError,
      lineCount: this.estimateLineCount(message),
      hasIcon,
    };
  }

  private static calculateWidth(metrics: ContentMetrics, opts: Required<DialogSizingOptions>): number {
    let width = opts.minWidth;

    // Base width for icon + content
    if (metrics.hasIcon) {
      width += 40; // Space for icon (24px icon + 16px margin)
    }

    // Width based on text length (rough estimation: 8px per character average)
    const textWidth = Math.min(metrics.textLength * 8, opts.maxWidth - opts.padding * 2);
    width = Math.max(width, textWidth + opts.padding * 2);

    // Additional width for input fields
    if (metrics.hasInput) {
      width = Math.max(width, 320); // Minimum comfortable width for input fields
    }

    // Ensure width accommodates buttons
    if (metrics.hasButtons) {
      width = Math.max(width, 280); // Minimum for button layout
    }

    // Apply constraints
    return Math.max(opts.minWidth, Math.min(width, opts.maxWidth));
  }

  private static calculateHeight(metrics: ContentMetrics, opts: Required<DialogSizingOptions>): number {
    // Dialog structure with fixed footer:
    // 1. Header (fixed: 36px)
    // 2. Content area (scrollable, starts with reasonable height)
    // 3. Footer with buttons (fixed: 52px including border)

    const headerHeight = 36;
    const footerHeight = 52; // Button container with border
    const horizontalPadding = opts.padding * 2;

    // Base dialog height
    let height = headerHeight + footerHeight + horizontalPadding;

    // Content area calculation - determine if scrolling is needed
    const lineHeight = 16;
    const maxContentLines = 8; // More lines before scrolling kicks in
    const contentLines = Math.min(Math.max(1, metrics.lineCount), maxContentLines);

    let contentHeight = contentLines * lineHeight;

    // Additional space for input fields
    if (metrics.hasInput) {
      contentHeight += 32; // Input field
      if (metrics.hasError) {
        contentHeight += 18; // Error message
      }
    }

    // Add content padding
    contentHeight += opts.padding;

    height += contentHeight;

    // Apply constraints - ensure minimum height for usability
    return Math.max(opts.minHeight, Math.min(height, opts.maxHeight));
  }

  private static estimateLineCount(text?: string): number {
    if (!text) return 0;

    // More conservative estimation: average 60 characters per line for better space utilization
    const estimatedLines = Math.ceil(text.length / 60);

    // Account for natural line breaks
    const explicitLines = (text.match(/\n/g) || []).length + 1;

    // Cap maximum reasonable lines to prevent excessive height
    const maxLines = 6;
    const calculatedLines = Math.max(estimatedLines, explicitLines);

    return Math.min(calculatedLines, maxLines);
  }

  /**
   * Get responsive size that fits within viewport
   */
  static getViewportConstrainedSize(
    size: Size,
    viewportWidth: number = window.innerWidth,
    viewportHeight: number = window.innerHeight,
  ): Size {
    const maxDialogWidth = Math.min(600, viewportWidth * 0.9);
    const maxDialogHeight = Math.min(500, viewportHeight * 0.8);

    return new Size(Math.min(size.width, maxDialogWidth), Math.min(size.height, maxDialogHeight));
  }

  /**
   * Create size options for different dialog types
   */
  static createSizeOptions(type: "input" | "confirm" | "info" | "error"): DialogSizingOptions {
    const baseOptions = {
      minWidth: 280,
      maxWidth: 600,
      minHeight: 120,
      maxHeight: 500,
      padding: 16,
      enableAutoResize: true,
    };

    switch (type) {
      case "input":
        return {
          ...baseOptions,
          minWidth: 320,
          minHeight: 160, // Slightly taller for input + fixed footer
        };
      case "confirm":
        return {
          ...baseOptions,
          minHeight: 140, // Minimum for confirm with fixed footer
        };
      case "error":
        return {
          ...baseOptions,
          minWidth: 320,
          minHeight: 150, // Minimum for error messages with fixed footer
        };
      default:
        return baseOptions;
    }
  }
}
