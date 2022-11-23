export class BaseComponent<T extends Function = Function> {
  constructor (public name: string, public handler: T, public id?: string) {}
}