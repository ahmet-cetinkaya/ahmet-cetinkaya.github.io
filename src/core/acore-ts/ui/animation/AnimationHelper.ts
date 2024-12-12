import Position from "../models/Position";

export default class AnimationHelper {
  static movePositionOnMouseMove(e: MouseEvent, movementStrength: number = 23): Position {
    const heightRatio = movementStrength / document.body.offsetHeight;
    const widthRatio = movementStrength / document.body.offsetWidth;
    const pageX = e.pageX - document.body.offsetWidth / 2;
    const pageY = e.pageY - document.body.offsetHeight / 2;
    const newValueX = widthRatio * pageX * -1;
    const newValueY = heightRatio * pageY * -1;
    return {
      top: newValueY,
      left: newValueX,
    } as Position;
  }

  static tiltElementOnMouseMove(e: MouseEvent, tiltStrength: number = 10): string {
    const bodyRect = document.body.getBoundingClientRect();
    const xPosition = (e.clientX - bodyRect.left) / bodyRect.width;
    const yPosition = (e.clientY - bodyRect.top) / bodyRect.height - 0.6;
    const xOffset = -(xPosition - 0.6);
    const dxNorm = Math.min(Math.max(xOffset, -0.6), 0.6);
    return `perspective(1000px) rotateY(${dxNorm * tiltStrength}deg) rotateX(${yPosition * tiltStrength}deg)`;
  }
}
