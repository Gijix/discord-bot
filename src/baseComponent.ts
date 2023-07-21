export abstract class BaseComponent<T extends Function = Function> {
  category?: string
  toJSON (object?: any) {
    const value = object || this

    if (['string', 'number', 'boolean'].includes(typeof value)) {
      return value
    }

    return Object.keys(value).reduce((acc, key) => {
      if (typeof key ==="symbol") {
        key = key.toString()
      }

      const ref = value[key]
      if (['string', 'number', 'boolean'].includes(typeof ref) || ref === null) {
        acc[key] = ref
      } else if (Array.isArray(ref)) {
        acc[key] = ref.map((item) => this.toJSON(item))
      } else if (typeof ref === "object") {
        acc[key] = this.toJSON(ref)
      }

      return acc
    } ,{} as Record<string, any>)
  }

  constructor (public name: string, public handler: T, public id?: string) {}
}
