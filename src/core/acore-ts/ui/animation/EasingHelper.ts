export default class EasingHelper {
  static easeOutCirc(x: number): number {
    return Math.sqrt(1 - (x - 1) ** 4);
  }

  static easeInQuad(x: number): number {
    return x * x;
  }

  static easeOutQuad(x: number): number {
    return 1 - (1 - x) * (1 - x);
  }

  static easeInOutQuad(x: number): number {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  }

  static easeInCubic(x: number): number {
    return x * x * x;
  }

  static easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
  }

  static easeInOutCubic(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
}
