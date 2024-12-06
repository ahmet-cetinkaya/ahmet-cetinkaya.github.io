import type { Size } from "./models/Size";

export class ResizeHelper {
  static makeResizableElement(
    element: HTMLElement,
    options: {
      onResizeStart?: (event: MouseEvent, size: Size) => void;
      onResizeEnd?: (event: MouseEvent, size: Size) => void;
    } = {},
  ) {
    const resizers = document.createElement("div");
    resizers.className = "resizers";

    const cornerResizerStyle = "width: 8px; height: 8px; position: absolute; z-index: 1;";
    const edgeResizerStyle = "position: absolute;";

    resizers.innerHTML = `
      <div class="resizer top-left" style="${cornerResizerStyle} top: 0; left: 0; cursor: nwse-resize;"></div>
      <div class="resizer top-right" style="${cornerResizerStyle} top: 0; right: 0; cursor: nesw-resize;"></div>
      <div class="resizer bottom-left" style="${cornerResizerStyle} bottom: 0; left: 0; cursor: nesw-resize;"></div>
      <div class="resizer bottom-right" style="${cornerResizerStyle} bottom: 0; right: 0; cursor: nwse-resize;"></div>
      <div class="resizer top" style="${edgeResizerStyle} top: 0; left: 8px; right: 8px; height: 8px; cursor: ns-resize;"></div>
      <div class="resizer bottom" style="${edgeResizerStyle} bottom: 0; left: 8px; right: 8px; height: 8px; cursor: ns-resize;"></div>
      <div class="resizer left" style="${edgeResizerStyle} top: 8px; bottom: 8px; left: 0; width: 8px; cursor: ew-resize;"></div>
      <div class="resizer right" style="${edgeResizerStyle} top: 8px; bottom: 8px; right: 0; width: 8px; cursor: ew-resize;"></div>
    `;
    element.appendChild(resizers);

    const resizersElements = resizers.querySelectorAll(".resizer");
    let originalWidth = 0;
    let originalHeight = 0;
    let originalX = 0;
    let originalY = 0;
    let originalMouseX = 0;
    let originalMouseY = 0;

    resizersElements.forEach((resizer) => {
      resizer.addEventListener("mousedown", (event: Event) => {
        event.preventDefault();
        const mouseEvent = event as MouseEvent;

        originalWidth = element.offsetWidth;
        originalHeight = element.offsetHeight;
        originalX = element.getBoundingClientRect().left;
        originalY = element.getBoundingClientRect().top;
        originalMouseX = mouseEvent.clientX;
        originalMouseY = mouseEvent.clientY;

        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResize);
        options.onResizeStart?.(mouseEvent, { width: originalWidth, height: originalHeight });
      });

      function resize(event: MouseEvent) {
        if (resizer.classList.contains("bottom-right")) {
          element.style.width = `${originalWidth + (event.clientX - originalMouseX)}px`;
          element.style.height = `${originalHeight + (event.clientY - originalMouseY)}px`;
        } else if (resizer.classList.contains("bottom-left")) {
          element.style.width = `${originalWidth - (event.clientX - originalMouseX)}px`;
          element.style.height = `${originalHeight + (event.clientY - originalMouseY)}px`;
          element.style.left = `${originalX + (event.clientX - originalMouseX)}px`;
        } else if (resizer.classList.contains("top-right")) {
          element.style.width = `${originalWidth + (event.clientX - originalMouseX)}px`;
          element.style.height = `${originalHeight - (event.clientY - originalMouseY)}px`;
          element.style.top = `${originalY + (event.clientY - originalMouseY)}px`;
        } else if (resizer.classList.contains("top-left")) {
          element.style.width = `${originalWidth - (event.clientX - originalMouseX)}px`;
          element.style.height = `${originalHeight - (event.clientY - originalMouseY)}px`;
          element.style.top = `${originalY + (event.clientY - originalMouseY)}px`;
          element.style.left = `${originalX + (event.clientX - originalMouseX)}px`;
        } else if (resizer.classList.contains("top")) {
          element.style.height = `${originalHeight - (event.clientY - originalMouseY)}px`;
          element.style.top = `${originalY + (event.clientY - originalMouseY)}px`;
        } else if (resizer.classList.contains("bottom")) {
          element.style.height = `${originalHeight + (event.clientY - originalMouseY)}px`;
        } else if (resizer.classList.contains("left")) {
          element.style.width = `${originalWidth - (event.clientX - originalMouseX)}px`;
          element.style.left = `${originalX + (event.clientX - originalMouseX)}px`;
        } else if (resizer.classList.contains("right")) {
          element.style.width = `${originalWidth + (event.clientX - originalMouseX)}px`;
        }
      }

      function stopResize(event: MouseEvent) {
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
        options.onResizeEnd?.(event, { width: element.offsetWidth, height: element.offsetHeight });
      }
    });
  }
}
