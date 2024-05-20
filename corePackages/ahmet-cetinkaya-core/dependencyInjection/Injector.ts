export class Injector {
  private static _instance: Injector = new Injector();
  
  constructor(initialContainer?: WeakMap<any, any>) {
    if (Injector._instance) 
      this._container = initialContainer!;
  }

  static getInstance(injectMap?: WeakMap<any, any>): Injector {
    if (injectMap)
      this._instance._container = injectMap;

    return Injector._instance;
  }

  private _container = new WeakMap<any, any>();

  register(token: any, value: any): void {
    this._container.set(token, value);
  }

  resolve<T>(token: any): T {
    if (!this._container.has(token)) 
      throw new Error(`Token not found in container: ${token}`);
    

    return this._container.get(token) as T;
  }
}
