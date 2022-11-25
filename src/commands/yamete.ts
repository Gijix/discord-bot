import { createReadStream } from 'fs';
import path from "path";
import { Command } from "../commandHandler.js";
import { 
  createAudioResource, 
  createAudioPlayer, 
  AudioPlayerStatus, 
  getVoiceConnection, 
  NoSubscriberBehavior, 
} from '@discordjs/voice';

export default new Command({
  name: "yamete",
  description: "Call the bot and says 'Yamete kudasai!!'",
  permissions: ['Administrator'],
  handler (message, bot) {
    if (!message.member!.voice.channel) return;

    let connection = getVoiceConnection(message.guildId!)!

    if (connection) return

    connection = bot.join(message)
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
      }
    })
  
    connection.subscribe(player)!

    const audioRessourse = createAudioResource(createReadStream(path.join(process.cwd(), "sounds", "yamete.mp3")))
    
    player.play(audioRessourse)
    player.on(AudioPlayerStatus.Idle ,() => {
        connection.destroy()
    })
  }
})
