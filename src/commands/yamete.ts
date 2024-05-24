import { createReadStream } from 'fs';
import path from "path";
import { Command } from "../handlers/commandHandler.js";
import { 
  createAudioResource, 
  createAudioPlayer, 
  AudioPlayerStatus, 
  getVoiceConnection, 
  NoSubscriberBehavior,
  StreamType, 
} from '@discordjs/voice';

export default new Command({
  name: "yamete",
  description: "Call the bot and says 'Yamete kudasai!!'",
  permissions: ['Administrator'],
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
  
    connection.subscribe(player)!

    const audioRessourse = createAudioResource(createReadStream(path.join(process.cwd(), "sounds", "yamete.ogg")),
    {
      inlineVolume: true,
      inputType: StreamType.OggOpus
    })
    
    player.play(audioRessourse)
    player.on(AudioPlayerStatus.Idle ,() => {
        connection.destroy()
    })
  }
})


type test = Omit