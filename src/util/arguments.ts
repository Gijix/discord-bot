/**
 * Example types
 */
interface Types {
  boolean: boolean
  number: number
  string: string
}

/**
 * Example input
 */
export interface Input<Name extends string, Type extends keyof Types> {
  readonly name: Name
  readonly type: Type
  readonly required?: boolean
}

type InputName<T> = T extends Input<infer Name, any> ? Name : never
type InputType<T> = T extends Input<any, infer Type> ? Types[Type] : never

export type InputDefault = readonly Input<any, any>[]

export type ArgsFunc<Inputs extends InputDefault> = {
  [K in InputName<Inputs[number]>]: InputType<Extract<Inputs[number], { name: K }>>
}


// class Example<const Flags extends InputDefault> {
//   constructor(
//     public flags: Flags,
//     public run: (outputs: ArgsFunc<Flags>) => void
//   ) {}
// }

// new Example([{
//   name: 'value',
//   type: 'boolean'
// }], 
// (outputs) => {
//   outputs.value
// })
