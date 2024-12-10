export class RgbaColor {
  constructor(
    public red: number,
    public green: number,
    public blue: number,
    public alpha: number = 1,
  ) {
    if (red < 0 || red > 255) throw new Error("Red must be between 0 and 255");
    if (green < 0 || green > 255) throw new Error("Green must be between 0 and 255");
    if (blue < 0 || blue > 255) throw new Error("Blue must be between 0 and 255");
    if (alpha < 0 || alpha > 1) throw new Error("Alpha must be between 0 and 1");
  }

  toString(): string {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
  }
}

export type HexColor = string;

export default class ColorHelper {
  static hexToRgb(hexColor: HexColor): RgbaColor {
    const hex = hexColor.replace(/^#/, "");
    if (![3, 6].includes(hex.length)) throw new Error("Invalid hex color format");

    if (hex.length === 3) {
      const [red, green, blue] = hex.split("");
      return new RgbaColor(parseInt(red + red, 16), parseInt(green + green, 16), parseInt(blue + blue, 16));
    }

    const bigint = parseInt(hex, 16);
    const red = (bigint >> 16) & 255;
    const green = (bigint >> 8) & 255;
    const blue = bigint & 255;
    return new RgbaColor(red, green, blue);
  }

  static rgbToHex(rgba: RgbaColor): HexColor {
    const redHex = rgba.red.toString(16).padStart(2, "0");
    const greenHex = rgba.green.toString(16).padStart(2, "0");
    const blueHex = rgba.blue.toString(16).padStart(2, "0");
    if (rgba.alpha === 1) return `#${redHex}${greenHex}${blueHex}`;
    const alphaHex = Math.round(rgba.alpha * 255)
      .toString(16)
      .padStart(2, "0");

    return `#${redHex}${greenHex}${blueHex}${alphaHex}`;
  }

  static setHexColorAlpha(hexColor: HexColor, alpha: number): HexColor {
    if (alpha < 0 || alpha > 1) throw new Error("Alpha must be between 0 and 1");
    const hex = hexColor.replace(/^#/, "");
    if (![3, 6].includes(hex.length)) throw new Error("Invalid hex color format");

    const fullHex =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => char + char)
            .join("")
        : hex;
    const red = fullHex.substring(0, 2);
    const green = fullHex.substring(2, 4);
    const blue = fullHex.substring(4, 6);
    const alphaHex = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");

    return `#${red}${green}${blue}${alphaHex}`;
  }

  static setRgbColorAlpha(rgbColor: RgbaColor, alpha: number): RgbaColor {
    if (alpha < 0 || alpha > 1) throw new Error("Alpha must be between 0 and 1");
    rgbColor.alpha = alpha;
    return rgbColor;
  }
}
