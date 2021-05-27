const tiltElementOnMouseMove = (e: MouseEvent, tiltStrength = 10): string => {
  const bodyRect: DOMRect = document.body.getBoundingClientRect();
  const xPosition = (e.clientX - bodyRect.left) / bodyRect.width,
    yPosition = (e.clientY - bodyRect.top) / bodyRect.height - 0.6,
    xOffset = -(xPosition - 0.6),
    dxNorm = Math.min(Math.max(xOffset, -0.6), 0.6),
    transform = `perspective(1000px)
        rotateY(${dxNorm * tiltStrength}deg)
        rotateX(${yPosition * tiltStrength}deg)`;
  return transform;
};
export default tiltElementOnMouseMove;
