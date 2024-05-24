import discord from "discord.js"

/**
 * Example types
 */
export interface Types {
  string: string
  number: number
  date: Date
  json: object
  boolean: boolean
  regex: RegExp
  array: Array<string>
  user: discord.User
  member: discord.GuildMember
  channel: discord.Channel
  message: discord.Message
  role: discord.Role
  emote: discord.GuildEmoji | string
  invite: discord.Invite
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
type InputType<T, S> = T extends Input<any, infer Type> ? (S extends true ? Types[Type] : Types[Type] | undefined) : never

export type InputDefault = readonly Input<any, any>[]

export type ArgsFunc<Inputs extends InputDefault> = {
  [K in InputName<Inputs[number]>]: InputType<Extract<Inputs[number], { name: K }>, Inputs[number]['required']>
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
