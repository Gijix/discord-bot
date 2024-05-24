import { getVoiceConnection, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { BaseGuildVoiceChannel, If } from "discord.js";

declare module 'discord.js' {
  interface BaseGuildVoiceChannel {
    join<T extends boolean> (force?: T): If<T, VoiceConnection, VoiceConnection | undefined>
  }
}

BaseGuildVoiceChannel.prototype.join = (function (force) {
  const baseConnection = getVoiceConnection(this.guildId)
  let connect = () => joinVoiceChannel({
    adapterCreator: this.guild.voiceAdapterCreator,
    channelId: this.id,
    guildId: this.guildId,
  })

  if (force) {
    baseConnection?.destroy()

    return connect()
  }

  return baseConnection ? undefined : connect()
} as <T extends boolean>(this: BaseGuildVoiceChannel , force?: T) => If<T, VoiceConnection, VoiceConnection | undefined>)

export {}
