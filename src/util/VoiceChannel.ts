import { DiscordGatewayAdapterCreator, DiscordGatewayAdapterLibraryMethods, getVoiceConnection, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { BaseGuildVoiceChannel, Guild, If, Snowflake, Status } from "discord.js";



declare module 'discord.js' {
  interface BaseGuildVoiceChannel {
    join<T extends boolean> (force?: T): If<T, VoiceConnection, VoiceConnection | undefined>
  }
}

const adapters = new Map<Snowflake, DiscordGatewayAdapterLibraryMethods>();

export function createDiscordJSAdapter(guild: Guild): DiscordGatewayAdapterCreator {
	return (methods) => {
		adapters.set(guild.id, methods);

		return {
			sendPayload(data) {
				if (guild.shard.status !== Status.Ready) return false;

				guild.shard.send(data);

				return true;
			},
			destroy() {
				adapters.delete(guild.id);
			},
		};
	};
}

BaseGuildVoiceChannel.prototype.join = (function (force) {
  let channel = this
  const baseConnection = getVoiceConnection(this.guildId)
  let connect = () => joinVoiceChannel({
    adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
    channelId: channel.id,
    guildId: channel.guildId,
  })

  if (force) {
    baseConnection?.destroy()

    return connect()
  }

  return baseConnection ? undefined : connect()
} as <T extends boolean>(this: BaseGuildVoiceChannel , force?: T) => If<T, VoiceConnection, VoiceConnection | undefined>)

export {}
