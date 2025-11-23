import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, DiscordGatewayAdapterLibraryMethods, entersState, getVoiceConnection, joinVoiceChannel, NoSubscriberBehavior, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { BaseGuildVoiceChannel, Guild, If, Snowflake, Status, VoiceBasedChannel } from "discord.js";
import prism from 'prism-media';
import ffmpeg from 'ffmpeg-static';


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

export async function handleAudio(connection: VoiceConnection, streamUrl: string) {
  connection.on(VoiceConnectionStatus.Signalling, () => console.debug('🛰️ VoiceConnection: Signalling...'));
      connection.on(VoiceConnectionStatus.Connecting, () => console.debug('🔄 VoiceConnection: Connecting...'));
      connection.on(VoiceConnectionStatus.Ready, () => console.log('✅ VoiceConnection: Ready.'));
      connection.on(VoiceConnectionStatus.Disconnected, () => console.warn('⚠️ VoiceConnection: Disconnected.'));
      connection.on(VoiceConnectionStatus.Destroyed, () => console.warn('💀 VoiceConnection: Destroyed.'));
      connection.on('error', (err) => console.error('💥 VoiceConnection Error:', err));

      console.debug('⏳ Waiting for VoiceConnection to reach Ready state...');
      await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
      console.log('✅ Voice connection established successfully.');

      console.log('🎵 Creating audio player...');
      const player = createAudioPlayer({
        behaviors: { noSubscriber: NoSubscriberBehavior.Pause }
      });

      player.on(AudioPlayerStatus.Idle, () => console.debug('⏹️ Player Status: Idle.'));
      player.on(AudioPlayerStatus.Buffering, () => console.debug('⏳ Player Status: Buffering...'));
      player.on(AudioPlayerStatus.Playing, () => console.log('🎶 Player Status: Playing live audio.'));
      player.on(AudioPlayerStatus.AutoPaused, () => console.warn('⏸️ Player Status: AutoPaused.'));
      player.on(AudioPlayerStatus.Paused, () => console.debug('⏸️ Player Status: Paused.'));
      player.on('error', (err) => console.error('🎧 Player Error:', err));

      console.log('🔗 Subscribing connection to player...');
      const subscription = connection.subscribe(player);
      if (!subscription) console.warn('⚠️ No player subscription returned!');

      console.log('⚙️ Launching FFmpeg process for stream transcoding...');
      const transcoder = new prism.FFmpeg({
        args: [
          '-reconnect', '1',
          '-reconnect_streamed', '1',
          '-reconnect_delay_max', '5',
          '-i', streamUrl,
          '-f', 's16le',
          '-ar', '48000',
          '-ac', '2',
          'pipe:1'
        ]
      });

      transcoder.on('spawn', () => console.debug('🧩 FFmpeg process spawned.'));
      transcoder.on('error', (err) => console.error('❌ FFmpeg error:', err));
      transcoder.on('close', (code, signal) =>
        console.log(`🧹 FFmpeg closed (code: ${code}, signal: ${signal}).`)
      );

      console.debug('🔊 Creating audio resource...');
      const resource = createAudioResource(transcoder, { inlineVolume: true });
      resource.volume?.setVolume(1.0);
      console.debug('✅ Audio resource created, starting playback...');

      player.play(resource);
      console.log('🚀 Playback started successfully.');
}

export {}
