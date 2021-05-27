const moveBackgroundPositionOnMouseMove = (e: MouseEvent, movementStrength = 23): string => {
  const height: number = movementStrength / document.body.offsetHeight;
  const width: number = movementStrength / document.body.offsetWidth;

  const pageX = e.pageX - width / 2,
    pageY = e.pageY - height / 2,
    newvalueX = width * pageX * -1,
    newvalueY = height * pageY * -1;

  return `calc( 50% + ${newvalueX}px ) calc( 50% + ${newvalueY}px )`;
};
export default moveBackgroundPositionOnMouseMove;
