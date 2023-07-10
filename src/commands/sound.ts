import { ApplicationCommandOptionType, GuildMember } from "discord.js";
import { getVoiceConnection, NoSubscriberBehavior, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType } from "@discordjs/voice";
import { Command } from "../handlers/commandHandler.js";
import { createReadStream } from "fs";
import { readdir } from "fs/promises";
import path from "path";

const soundList = await (async () => {
  const files = await readdir((path.join(process.cwd(), 'sounds', 'naru')), { withFileTypes: true})

  return files.map((file) =>  {
    if (!file.name.endsWith('mp3')) {
      throw new Error('invalid mp3')
    }

    return { name: file.name, value: file.name }
  })
})()

export default new Command({
  name: 'so',
  description: 'use soundboard',
  isSlash: true,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      description: 'the soundboard you want',
      name: 'sound',
      choices: soundList,
      required: true
    }
  ],
  handler (interaction) {
    console.log('getting interaction')
    const member = interaction.member as GuildMember
    if (!member.voice.channel) return;

    let connection = getVoiceConnection(interaction.guildId!)!

    if (connection && connection.joinConfig.channelId !== member.voice.channelId) return

    connection = connection || this.join(member)
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
      }
    })
    connection.subscribe(player)!

    const audioRessourse = createAudioResource(createReadStream(path.join(process.cwd(), "sounds", "naru", interaction.options.getString('sound', true))),
    {
      inlineVolume: true,
      inputType: StreamType.OggOpus
    })
    player.play(audioRessourse)
    player.on(AudioPlayerStatus.Idle ,() => {
        connection.destroy()
    })

    interaction.reply({ ephemeral: true, content: 'launching the soudnoard'})
  }
})