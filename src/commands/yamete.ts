import { createReadStream } from 'fs';
import path from "path";
import { Command } from "../handlers/commandHandler.js";
import { 
  createAudioResource, 
  createAudioPlayer, 
  AudioPlayerStatus, 
  NoSubscriberBehavior,
  StreamType,
  demuxProbe,
} from '@discordjs/voice';

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
    console.log(path.join(process.cwd(), "sounds", "yamete.ogg"))
    const stream = createReadStream(path.join(process.cwd(), "sounds", "yamete.ogg"))

    await demuxProbe(stream).then(info => console.log(info.type))
    const audioRessourse = createAudioResource(createReadStream(path.join(process.cwd(), "sounds", "yamete.ogg")),
    {
      inlineVolume: true,
      inputType: StreamType.Arbitrary,
    })
    console.log('gonna play')

    player.play(audioRessourse)

    player.on(AudioPlayerStatus.Idle ,() => {
        connection.destroy()
    })

    player.on(AudioPlayerStatus.Playing, () => {
      console.log('playing')
    })
  }
})
