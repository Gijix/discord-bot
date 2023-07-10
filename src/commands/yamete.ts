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
  handler (message) {
    if (!message.member!.voice.channel) return;

    let connection = getVoiceConnection(message.guildId!)!

    if (connection && connection.joinConfig.channelId !== message.member.voice.channelId) return

    connection = connection || this.join(message.member)
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
