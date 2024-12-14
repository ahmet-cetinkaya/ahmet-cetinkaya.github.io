export default class Injector {
  private static _instance: Injector = new Injector();
  private container = new WeakMap<object, unknown>();

  constructor(initialContainer?: WeakMap<object, unknown>) {
    if (Injector._instance) this.container = initialContainer!;
  }

  get instance(): Injector {
    return Injector._instance;
  }

  static getInstance(injectMap: WeakMap<object, unknown>): Injector {
    if (injectMap) this._instance.container = injectMap;
    return Injector._instance;
  }

  register(token: object, value: unknown): void {
    this.container.set(token, value);
  }

  resolve<T>(token: object): T {
    if (!this.container.has(token)) throw new Error(`Token not found in container: ${token}`);
    return this.container.get(token) as T;
  }
}
