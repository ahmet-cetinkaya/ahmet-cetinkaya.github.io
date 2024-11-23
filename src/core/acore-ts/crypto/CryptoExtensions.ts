export class CryptoExtensions {
  public static generateNanoId(length: number = 8): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";

    for (let i = 0; i < length; i++) {
      if (i === 0) {
        const charsOnlyLetters = chars.slice(0, chars.length - 10);
        id += charsOnlyLetters.charAt(Math.floor(Math.random() * charsOnlyLetters.length));
        continue;
      }

      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
  }
}
