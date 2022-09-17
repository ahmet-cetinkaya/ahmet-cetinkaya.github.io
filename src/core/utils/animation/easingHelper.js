/* eslint-disable import/prefer-default-export */

export function easeOutCirc(x) {
  return Math.sqrt(1 - (x - 1) ** 4);
}
