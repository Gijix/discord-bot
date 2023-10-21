import { GuildMember, Message, VoiceState } from "discord.js"
import { GuildDb } from "../database.js"

export const checkLogChannel = (_target: any, _key: string, descriptor: TypedPropertyDescriptor<Function>) => {
  if (!(typeof descriptor.value === 'function')) return
  const fn = descriptor.value
  descriptor.value = async function (firstArg: VoiceState | GuildMember | Message<true> , ...arg: any[]) {
    const guild = await GuildDb.ensure(firstArg.guild.id)
    if (!guild.guildInfo.logCanalId) return
    if (firstArg instanceof GuildMember) {
      if (firstArg.user.bot) return
    } else {
      if (firstArg.member?.user.bot) return 
    }

    return fn(firstArg,...arg)
  }
}
