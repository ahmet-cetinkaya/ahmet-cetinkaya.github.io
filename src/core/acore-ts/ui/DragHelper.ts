import type { Offset } from "./models/Offset";
import Position from "./models/Position";

export default class DragHelper {
  static makeDraggableElement(
    element: HTMLElement,
    options: {
      offset?: Offset;
      onDragStart?: (event: MouseEvent, position: Position) => void;
      onDragEnd?: (event: MouseEvent, position: Position) => void;
    } = {},
  ) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    const headerElement = element.querySelector("header") as HTMLElement;
    const dragElement = headerElement || element;

    dragElement.addEventListener("mousedown", dragMouseDown);

    function dragMouseDown(event: MouseEvent) {
      const targetTag = (event.target as HTMLElement).tagName;
      if (["BUTTON", "A", "INPUT", "TEXTAREA", "SELECT"].includes(targetTag)) {
        return; // Allow default action for interactive elements
      }

      event.preventDefault();
      pos3 = event.clientX;
      pos4 = event.clientY;
      document.addEventListener("mouseup", closeDragElement);
      document.addEventListener("mousemove", elementDrag);
      options.onDragStart?.(event, new Position(element.offsetTop, element.offsetLeft));
    }

    function elementDrag(event: MouseEvent) {
      event.preventDefault();

      pos1 = pos3 - event.clientX;
      pos2 = pos4 - event.clientY;
      pos3 = event.clientX;
      pos4 = event.clientY;

      const newTop = element.offsetTop - pos2;
      const newLeft = element.offsetLeft - pos1;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const elementWidth = element.offsetWidth;
      const elementHeight = element.offsetHeight;

      const offsetTop = options.offset?.top ?? 0;
      const offsetLeft = options.offset?.left ?? 0;
      const offsetRight = options.offset?.right ?? 0;
      const offsetBottom = options.offset?.bottom ?? 0;

      if (newTop >= offsetTop && newTop + elementHeight <= screenHeight - offsetBottom) {
        element.style.top = `${newTop}px`;
      }
      if (newLeft >= offsetLeft && newLeft + elementWidth <= screenWidth - offsetRight) {
        element.style.left = `${newLeft}px`;
      }

      element.style.cursor = "grabbing";
    }

    function closeDragElement(event: MouseEvent) {
      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("mousemove", elementDrag);

      element.style.cursor = "default";
      options.onDragEnd?.(event, new Position(element.offsetTop, element.offsetLeft));
    }
  }
}
