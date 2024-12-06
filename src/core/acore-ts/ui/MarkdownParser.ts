export type MarkdownOptions = {
  header1?: {
    class?: string;
  };
  header2?: {
    class?: string;
  };
  header3?: {
    class?: string;
  };
  header4?: {
    class?: string;
  };
  header5?: {
    class?: string;
  };
  header6?: {
    class?: string;
  };

  bold?: {
    class?: string;
  };
  italic?: {
    class?: string;
  };

  unorderedList?: {
    class?: string;
  };
  orderedList?: {
    class?: string;
  };
  listItem?: {
    class?: string;
  };

  image?: {
    class?: string;
  };

  link?: {
    class?: string;
  };

  blockquote?: {
    class?: string;
  };

  table?: {
    class?: string;
  };
  tableHeader?: {
    class?: string;
  };
  tableRow?: {
    class?: string;
  };
  tableCell?: {
    class?: string;
  };

  codeBlock?: {
    class?: string;
  };
  inlineCode?: {
    class?: string;
  };
};

export default class MarkdownParser {
  static parse(markdown: string, options?: MarkdownOptions): string {
    markdown = this._parseHeaders(markdown, options);
    markdown = this._parseBoldAndItalic(markdown, options);
    markdown = this._parseUnorderedLists(markdown, "*", options);
    markdown = this._parseUnorderedLists(markdown, "-", options);
    markdown = this._parseOrderedLists(markdown, options);
    markdown = this._parseImages(markdown, options);
    markdown = this._parseLinks(markdown, options);
    markdown = this._parseBlockQuotes(markdown, options);
    markdown = this._parseTables(markdown, options);
    markdown = this._parseCodeBlocks(markdown, options);
    markdown = this._parseInlineCode(markdown, options);
    markdown = this._parseNewLines(markdown);

    return markdown;
  }

  private static _parseHeaders(markdown: string, options?: MarkdownOptions): string {
    return markdown
      .replace(/^###### (.*$)/gim, `<h6 class="${options?.header6?.class || ""}">$1</h6>`) // ###### Header 6
      .replace(/^##### (.*$)/gim, `<h5 class="${options?.header5?.class || ""}">$1</h5>`) // ##### Header 5
      .replace(/^#### (.*$)/gim, `<h4 class="${options?.header4?.class || ""}">$1</h4>`) // #### Header 4
      .replace(/^### (.*$)/gim, `<h3 class="${options?.header3?.class || ""}">$1</h3>`) // ### Header 3
      .replace(/^## (.*$)/gim, `<h2 class="${options?.header2?.class || ""}">$1</h2>`) // ## Header 2
      .replace(/^# (.*$)/gim, `<h1 class="${options?.header1?.class || ""}">$1</h1>`); // # Header 1
  }

  private static _parseBoldAndItalic(markdown: string, options?: MarkdownOptions): string {
    return markdown
      .replace(/(\*\*|__)(.*?)\1/g, `<strong class="${options?.bold?.class || ""}">$2</strong>`) // **bold**
      .replace(/(\*|_)(.*?)\1/g, `<em class="${options?.italic?.class || ""}">$2</em>`); // *italic*
  }

  private static _parseUnorderedLists(markdown: string, listChar: string, options?: MarkdownOptions): string {
    const lines = markdown.split("\n");
    let isListStarted = false;
    let listIndentLevel = 0;
    const listItemRegex = new RegExp(`^\\s*\\${listChar}\\s+.*`); // * or - List item

    for (let i = 0; i < lines.length; ++i) {
      const line = lines[i];
      if (!line) continue;

      if (line.match(listItemRegex)) {
        if (!isListStarted) {
          lines[i] =
            `<ul class="${options?.unorderedList?.class || ""}">\n<li class="${options?.listItem?.class || ""}">` +
            this._cleanListItem(line, listChar) +
            "</li>";
          isListStarted = true;
          listIndentLevel = 0;
          continue;
        }

        const lineIndentLevel = line.match(/^\s*/)![0].length;

        if (lineIndentLevel > listIndentLevel) {
          lines[i - 1] += `<ul class="${options?.unorderedList?.class || ""}">`;
        }
        lines[i] = `<li class="${options?.listItem?.class || ""}">` + this._cleanListItem(line, listChar) + "</li>";
        if (lineIndentLevel < listIndentLevel) {
          lines[i - 2] += "</ul>";
        }
        listIndentLevel = lineIndentLevel;
      } else {
        if (isListStarted) {
          if (listIndentLevel > 0) lines[i - 2] += "</ul>";
          lines[i - 2] += "</ul>";
          isListStarted = false;
        }
      }
    }

    return lines.join("\n");
  }

  private static _cleanListItem(line: string, listChar: string): string {
    const listItemRegex = new RegExp(`^\\s*\\${listChar}\\s+`);
    return line.replace(listItemRegex, "");
  }

  private static _parseOrderedLists(markdown: string, options?: MarkdownOptions): string {
    const lines = markdown.split("\n");
    let isListStarted = false;
    let listIndentLevel = 0;
    const listItemRegex = /^\s*\d+\.\s+.*$/; // Ordered list item

    for (let i = 0; i < lines.length; ++i) {
      const line = lines[i];
      if (!line) continue;

      if (line.match(listItemRegex)) {
        if (!isListStarted) {
          lines[i] =
            `<ol class="${options?.orderedList?.class || ""}">\n<li class="${options?.listItem?.class || ""}">` +
            this._cleanOrderedListItem(line) +
            "</li>";
          isListStarted = true;
          listIndentLevel = 0;
          continue;
        }

        const lineIndentLevel = line.match(/^\s*/)![0].length;

        if (lineIndentLevel > listIndentLevel) {
          lines[i - 1] += `<ol class="${options?.orderedList?.class || ""}">`;
        }
        lines[i] = `<li class="${options?.listItem?.class || ""}">` + this._cleanOrderedListItem(line) + "</li>";
        if (lineIndentLevel < listIndentLevel) {
          lines[i - 2] += "</ol>";
        }
        listIndentLevel = lineIndentLevel;
      } else {
        if (isListStarted) {
          if (listIndentLevel > 0) lines[i - 2] += "</ol>";
          lines[i - 2] += "</ol>";
          isListStarted = false;
        }
      }
    }

    return lines.join("\n");
  }

  private static _cleanOrderedListItem(line: string): string {
    const listItemRegex = /^\s*\d+\.\s+/;
    return line.replace(listItemRegex, "");
  }

  private static _parseImages(markdown: string, options?: MarkdownOptions): string {
    return markdown.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      `<img alt="$1" src="$2" class="${options?.image?.class || ""}" />`,
    ); // ![alt text](image.jpg)
  }

  private static _parseLinks(markdown: string, options?: MarkdownOptions): string {
    return markdown.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      `<a href="$2" class="${options?.link?.class || ""}" target="_blank" rel="noopener noreferrer">$1</a>`,
    ); // [link text](https://example.com)
  }
  private static _parseBlockQuotes(markdown: string, options?: MarkdownOptions): string {
    const lines = markdown.split("\n");
    let isBlockquoteStarted = false;
    let blockquoteLevel = 0;

    for (let i = 0; i < lines.length; ++i) {
      const line = lines[i];
      const blockquoteMatch = line.match(/^\s*(>+)\s+(.*)$/); // > Blockquote

      if (blockquoteMatch) {
        const currentLevel = blockquoteMatch[1].length;
        const content = blockquoteMatch[2];

        if (!isBlockquoteStarted) {
          lines[i] = `<blockquote class="${options?.blockquote?.class || ""}">`.repeat(currentLevel) + content;
          isBlockquoteStarted = true;
          blockquoteLevel = currentLevel;
        } else {
          if (currentLevel > blockquoteLevel) {
            lines[i - 1] += `<blockquote class="${options?.blockquote?.class || ""}">`.repeat(
              currentLevel - blockquoteLevel,
            );
          } else if (currentLevel < blockquoteLevel) {
            lines[i - 1] += "</blockquote>".repeat(blockquoteLevel - currentLevel);
          }
          lines[i] = content;
          blockquoteLevel = currentLevel;
        }
      } else {
        if (isBlockquoteStarted) {
          lines[i - 1] += "</blockquote>".repeat(blockquoteLevel);
          isBlockquoteStarted = false;
          blockquoteLevel = 0;
        }
      }
    }

    if (isBlockquoteStarted) {
      lines[lines.length - 1] += "</blockquote>".repeat(blockquoteLevel);
    }

    return lines.join("\n");
  }

  private static _parseTables(markdown: string, options?: MarkdownOptions): string {
    const lines = markdown.split("\n");
    let isTableStarted = false;
    let tableHtml = "";
    let headers = "";
    let alignments: string[] = [];
    let rows = "";

    for (let i = 0; i < lines.length; ++i) {
      const line = lines[i];
      if (line.match(/^\|.*\|$/)) {
        // | Table row |
        if (!isTableStarted) {
          isTableStarted = true;
          headers = line;
          tableHtml += `<table class="${options?.table?.class || ""}"><thead><tr>`;
          headers.split("|").forEach((header) => {
            if (header.trim()) {
              tableHtml += `<th class="${options?.tableHeader?.class || ""}">${header.trim()}</th>`;
            }
          });
          tableHtml += "</tr></thead><tbody>";
          i += 1; // skip ------ lines
        } else if (line.match(/^\|[-:]+\|$/)) {
          // Alignment row
          alignments = line.split("|").map((cell) => {
            if (cell.trim().startsWith(":") && cell.trim().endsWith(":")) {
              return "center";
            } else if (cell.trim().endsWith(":")) {
              return "right";
            } else {
              return "left";
            }
          });
        } else {
          rows += "<tr>";
          line.split("|").forEach((cell, index) => {
            if (cell.trim()) {
              const alignment = alignments[index] || "left";
              rows += `<td class="${options?.tableCell?.class || ""}" style="text-align: ${alignment};">${cell.trim()}</td>`;
            }
          });
          rows += "</tr>";
        }
      } else {
        if (isTableStarted) {
          tableHtml += rows + "</tbody></table>";
          isTableStarted = false;
          rows = "";
        }
        tableHtml += line + "\n";
      }
    }

    if (isTableStarted) {
      tableHtml += rows + "</tbody></table>";
    }

    return tableHtml;
  }

  private static _parseCodeBlocks(markdown: string, options?: MarkdownOptions): string {
    return markdown.replace(/```([\s\S]*?)```/g, `<pre class="${options?.codeBlock?.class || ""}">$1</pre>`); // ```code block```
  }

  private static _parseInlineCode(markdown: string, options?: MarkdownOptions): string {
    return markdown.replace(/`([^`]+)`/g, `<code class="${options?.inlineCode?.class || ""}">$1</code>`); // `inline code`
  }

  private static _parseNewLines(markdown: string): string {
    const lines = markdown.split("\n");
    for (let i = 0; i < lines.length; ++i) {
      if (lines[i].trim() === "") lines[i] = lines[i] + "<br /><br />";
    }
    return lines.join("\n").replace(/<br \/><br \/>$/, "");
  }
}
