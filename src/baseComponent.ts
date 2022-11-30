export class BaseComponent<T extends Function = Function> {
  category?: string
  toJSON () {
    return Object.keys(this).reduce((acc, key) => {
      if (['string', 'number', 'boolean'].includes(typeof this[key as keyof this])) {
        acc[key] = this[key as keyof this]
      }
 
      return acc
    } ,{} as Record<string, any>)
  }
  constructor (public name: string, public handler: T, public id?: string) {}
}
