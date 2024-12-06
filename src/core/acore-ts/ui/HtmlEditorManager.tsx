export type FormatType = "b" | "u" | "i" | "h1" | "h2" | "ul" | "ol" | "a";

export default class HtmlEditorManager {
  urlPromptText = "Enter the URL:";

  private _editorElement: HTMLElement;
  private _onInput: (html: string) => void;

  constructor(editorElement: HTMLElement, onInput: (html: string) => void) {
    this._editorElement = editorElement;
    this._onInput = onInput;
  }

  handleInputChange = () => {
    const html = this._editorElement?.innerHTML || "";
    this._onInput(html);
  };

  formatText = (tag: FormatType) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (!selectedText.trim()) return;

    const parentElement = range.commonAncestorContainer.parentElement;

    if (this._isTagApplied(parentElement, tag)) this._removeTag(parentElement, selection);
    else this._applyTag(range, tag, selectedText, selection);

    if (this._editorElement) this._onInput(this._editorElement.innerHTML);
  };

  private _isTagApplied = (parentElement: Element | null, tag: FormatType) => {
    return parentElement && parentElement.tagName.toLowerCase() === tag;
  };

  private _removeTag = (parentElement: Element | null, selection: Selection) => {
    if (!parentElement) return;

    const fragment = document.createDocumentFragment();
    Array.from(parentElement.childNodes).forEach((child) => {
      fragment.appendChild(child.cloneNode(true));
    });

    parentElement.parentNode!.replaceChild(fragment, parentElement);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartBefore(fragment.firstChild!);
    newRange.setEndAfter(fragment.lastChild!);
    selection.addRange(newRange);
  };

  private _applyTag = (range: Range, tag: FormatType, selectedText: string, selection: Selection) => {
    if (range.startContainer !== range.endContainer) {
      this._handleMultiContainerSelection(range, selectedText, selection);
    }

    const wrapper = document.createElement(tag);
    this._applyFormattingStyles(tag, wrapper);

    if (tag === "ul" || tag === "ol") {
      const lines = selectedText.split("\n");
      lines.forEach((line) => {
        const listItem = document.createElement("li");
        listItem.textContent = line;
        wrapper.appendChild(listItem);
      });
    } else {
      wrapper.textContent = selectedText;
    }

    if (tag === "a") {
      const url = prompt(this.urlPromptText);
      if (!url) return;
      (wrapper as HTMLAnchorElement).href = url;
    }

    range.deleteContents();
    range.insertNode(wrapper);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartBefore(wrapper);
    newRange.setEndAfter(wrapper);
    selection.addRange(newRange);
  };

  private _handleMultiContainerSelection = (range: Range, selectedText: string, selection: Selection) => {
    const textNodes = selectedText.split("").map((char) => document.createTextNode(char));
    range.deleteContents();
    textNodes.forEach((node) => range.insertNode(node));

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartBefore(textNodes[0]);
    newRange.setEndAfter(textNodes[textNodes.length - 1]);
    selection.addRange(newRange);
  };

  clearFormat = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const fragment = range.cloneContents();
    const textNodes = document.createDocumentFragment();

    const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      textNodes.appendChild(node.cloneNode());
    }

    range.deleteContents();
    range.insertNode(textNodes);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartBefore(textNodes.firstChild!);
    newRange.setEndAfter(textNodes.lastChild!);
    selection.addRange(newRange);

    this.handleInputChange();
  };

  attachEventListeners = () => {
    if (this._editorElement) {
      this._editorElement.addEventListener("input", this.handleInputChange);
    }
  };

  detachEventListeners() {
    if (this._editorElement) {
      this._editorElement.removeEventListener("input", this.handleInputChange);
    }
  }

  private _applyFormattingStyles(
    tag: string,
    wrapper: HTMLElement | HTMLHeadingElement | HTMLUListElement | HTMLOListElement | HTMLAnchorElement,
  ) {
    switch (tag) {
      case "b":
        wrapper.style.fontWeight = "bold";
        break;
      case "u":
        wrapper.style.textDecoration = "underline";
        break;
      case "i":
        wrapper.style.fontStyle = "italic";
        break;
      case "h1":
        wrapper.style.fontSize = "2em";
        break;
      case "h2":
        wrapper.style.fontSize = "1.5em";
        break;
      case "ul":
        wrapper.style.listStyleType = "disc";
        break;
      case "ol":
        wrapper.style.listStyleType = "decimal";
        break;
      case "a":
        wrapper.style.color = "#007bff";
        wrapper.style.textDecoration = "underline";
        break;
    }
  }
}
