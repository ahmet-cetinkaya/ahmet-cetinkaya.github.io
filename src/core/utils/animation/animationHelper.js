export function moveBackgroundPositionOnMouseMove(e, movementStrength = 23) {
  const height = movementStrength / document.body.offsetHeight;
  const width = movementStrength / document.body.offsetWidth;
  const pageX = e.pageX - width / 2;
  const pageY = e.pageY - height / 2;
  const newvalueX = width * pageX * -1;
  const newvalueY = height * pageY * -1;
  const backgroundPotisionStyleValue = `calc( 50% + ${newvalueX}px ) calc( 50% + ${newvalueY}px )`;
  return backgroundPotisionStyleValue;
}

export function tiltElementOnMouseMove(e, tiltStrength = 10) {
  const bodyRect = document.body.getBoundingClientRect();
  const xPosition = (e.clientX - bodyRect.left) / bodyRect.width;
  const yPosition = (e.clientY - bodyRect.top) / bodyRect.height - 0.6;
  const xOffset = -(xPosition - 0.6);
  const dxNorm = Math.min(Math.max(xOffset, -0.6), 0.6);
  const transformStyleValue = `perspective(1000px)
            rotateY(${dxNorm * tiltStrength}deg)
            rotateX(${yPosition * tiltStrength}deg)`;
  return transformStyleValue;
}
