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
    minWidth: 260,
    maxWidth: 0, // 0 means no max width limit (only viewport)
    minHeight: 80,
    maxHeight: 0, // 0 means no max height limit (only viewport)
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
      width += 32; // Space for icon (32px icon + minimal margin)
    }

    // Width based on text length - dynamic without fixed max
    const textWidth = metrics.textLength * 7; // Tighter character spacing
    width = Math.max(width, textWidth + opts.padding * 2);

    // Additional width for input fields - better usability
    if (metrics.hasInput) {
      width = Math.max(width, 320); // Better width for input fields
    }

    // Ensure width accommodates buttons - minimal
    if (metrics.hasButtons) {
      width = Math.max(width, 260); // Minimum for button layout
    }

    // Only apply minimum constraint, no maximum (except viewport)
    return Math.max(opts.minWidth, width);
  }

  private static calculateHeight(metrics: ContentMetrics, opts: Required<DialogSizingOptions>): number {
    // Dialog structure with fully dynamic sizing:
    // 1. Header (minimal: 28px)
    // 2. Content area (completely dynamic)
    // 3. Footer with buttons (minimal: 40px)

    const headerHeight = 28;
    const footerHeight = 40; // Minimal button container
    const verticalPadding = opts.padding * 1.5; // Reduced vertical padding

    // Base dialog height (header + footer + minimal padding)
    let baseHeight = headerHeight + footerHeight + verticalPadding;

    // Dynamic content area calculation - no arbitrary limits
    const lineHeight = 14; // Tight line height
    const contentLines = Math.max(0, metrics.lineCount);

    // Calculate content height purely based on content
    let contentHeight = contentLines * lineHeight;

    // Additional space for input fields - better usability
    if (metrics.hasInput) {
      contentHeight += 36; // Better spacing for input field + label
      if (metrics.hasError) {
        contentHeight += 20; // Better spacing for error message
      }
    }

    // Add minimal content padding
    contentHeight += Math.floor(opts.padding * 0.5);

    // Total height calculation - no artificial constraints
    const totalHeight = baseHeight + contentHeight;

    // Only apply viewport constraint (75% of viewport) and minimum
    const viewportHeight = window.innerHeight;
    const maxViewportHeight = viewportHeight * 0.75;

    // Apply only minimum and viewport constraints
    const finalHeight = Math.max(opts.minHeight, Math.min(totalHeight, maxViewportHeight));

    return finalHeight;
  }

  private static estimateLineCount(text?: string): number {
    if (!text) return 0;

    // Fully dynamic estimation - no artificial caps
    const charsPerLine = 90; // Better line utilization for modern screens
    const estimatedLines = Math.ceil(text.length / charsPerLine);

    // Account for natural line breaks
    const explicitLines = (text.match(/\n/g) || []).length + 1;

    // No artificial line limits - let content determine height
    const calculatedLines = Math.max(estimatedLines, explicitLines);

    return calculatedLines;
  }

  /**
   * Get responsive size that fits within viewport
   */
  static getViewportConstrainedSize(
    size: Size,
    viewportWidth: number = window.innerWidth,
    viewportHeight: number = window.innerHeight,
  ): Size {
    // Only apply viewport constraints, no fixed size limits
    const maxDialogWidth = viewportWidth * 0.95; // 95% of viewport width
    const maxDialogHeight = viewportHeight * 0.85; // 85% of viewport height

    return new Size(Math.min(size.width, maxDialogWidth), Math.min(size.height, maxDialogHeight));
  }

  /**
   * Create size options for different dialog types
   */
  static createSizeOptions(type: "input" | "confirm" | "info" | "error"): DialogSizingOptions {
    const baseOptions = {
      minWidth: 260,
      maxWidth: 0, // No fixed max width - only viewport
      minHeight: 80,
      maxHeight: 0, // No fixed max height - only viewport
      padding: 16,
      enableAutoResize: true,
    };

    switch (type) {
      case "input":
        return {
          ...baseOptions,
          minWidth: 320, // Better width for input usability
          minHeight: 120, // Better height for input + labels
        };
      case "confirm":
        return {
          ...baseOptions,
          minWidth: 260, // Minimal width for confirm buttons
          minHeight: 80,  // Minimal height, grows with content
        };
      case "error":
        return {
          ...baseOptions,
          minWidth: 260, // Minimal width for error display
          minHeight: 85,  // Minimal height, grows with content
        };
      default:
        return baseOptions;
    }
  }
}
