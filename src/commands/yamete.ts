import { createAudioResource, createAudioPlayer, AudioPlayerStatus, getVoiceConnection, NoSubscriberBehavior } from '@discordjs/voice';
import path from "path";
import { Command } from "../commandHandler.js";

export default new Command({
  name: "yamete",
  description: "Call the bot and says 'Yamete kudasai!!'",
  handler (message, bot) {
    if (!message.member!.voice.channel) return;

    let connection = getVoiceConnection(message.guildId!)!

    if (connection) return

    connection = bot.join(message)
    const { player } = connection.subscribe(createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause
        }
    }))!
    const audioRessourse = createAudioResource(path.join(__dirname,"../../sounds/yamete.mp3"))

    player.play(audioRessourse)
    player.on(AudioPlayerStatus.Idle ,() => {
        connection.destroy()
    })
  }
})
