export class BaseComponent<T extends Function = Function> {
  category?: string
  toJSON (object?: any) {
    const value = object || this
    Object.keys(value).reduce((acc, key) => {
      const ref = value[key as keyof typeof value]
      console.log(ref)
      if (['string', 'number', 'boolean'].includes(typeof ref)) {
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
