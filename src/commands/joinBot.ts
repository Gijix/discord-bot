import { joinVoiceChannel } from '@discordjs/voice';
import { Command } from "../handlers/commandHandler.js";


export default new Command({
  name: "join",
  description: "Make the bot join current voice channel",
  permissions: ["Administrator"],
  guildOnly: true,
  async handler (message) {
    const guild = message.guild;
    const channelJoin = guild.channels.cache.find(chan => chan.name === message.arguments[0])
    channelJoin && joinVoiceChannel({
      channelId:channelJoin.id,
      guildId:guild.id,
      adapterCreator:guild.voiceAdapterCreator
    })
  }
})
