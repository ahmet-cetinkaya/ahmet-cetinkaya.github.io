import { Position } from "./models/Position";

export class DragHelper {
  static makeDraggableElement(
    element: HTMLElement,
    options: {
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

      if (newTop >= 0 && newTop + elementHeight <= screenHeight) {
        element.style.top = `${newTop}px`;
      }
      if (newLeft >= 0 && newLeft + elementWidth <= screenWidth) {
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
