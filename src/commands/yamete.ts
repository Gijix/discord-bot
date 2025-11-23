import { createReadStream } from 'fs';
import path from "path";
import { Command } from "../handlers/commandHandler.js";
import { 
  createAudioResource, 
  createAudioPlayer, 
  AudioPlayerStatus, 
  NoSubscriberBehavior,
  StreamType,
} from '@discordjs/voice';
import Stream from 'stream';

export default new Command({
  name: "yamete",
  description: "Call the bot and says 'Yamete kudasai!!'",
  
  guildOnly: true,
  async handler (message) {
    const channel = message.member.voice.channel
    if (!channel) return;

    const connection = channel.join()

    if (!connection) {
      return message.reply('bot already in a voice channel')
    }

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
      }
    })
   
    connection.subscribe(player)

    const filePath = path.join(process.cwd(), 'sounds', 'yamete.ogg');
    let inputStream: Stream.Readable = createReadStream(filePath)

    inputStream.resume();

    const resource = createAudioResource(inputStream, {
      inputType: StreamType.Arbitrary,  // Raw → auto-encode Opus, bye désync
      inlineVolume: true,
      // BUFFER MAGIC (fix 2025 pour -6ms timeouts)
      silencePaddingFrames: 1000,
    });

    resource.volume?.setVolume(1.0);  // Max volume safe
    player.play(resource);

    player.on(AudioPlayerStatus.Playing, () => {
      console.log('▶️ Playing — attends 1s pour buffer, puis SON !');
    });

    player.on(AudioPlayerStatus.Idle, () => {
      console.log('⏹️ Idle — fin OK');
      connection.destroy();  // Flush final
    });
  }
})
