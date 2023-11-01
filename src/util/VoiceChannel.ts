import { getVoiceConnection, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { BaseGuildVoiceChannel } from "discord.js";

declare module 'discord.js' {
  interface BaseGuildVoiceChannel {
    join (force: false): VoiceConnection | undefined
    join (force: true): VoiceConnection
    join (): VoiceConnection | undefined
  }
}
//@ts-ignore
BaseGuildVoiceChannel.prototype.join = function (force) {
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
}

export {}
