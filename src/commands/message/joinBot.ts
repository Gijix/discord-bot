import { joinVoiceChannel } from '@discordjs/voice';
import { Command } from "../../commandHandler.js";


export default new Command({
  name: "join",
  description: "Make the bot join current voice channel",
  permissions: ["Administrator"],
  async handler (message) {
    let arg = message.content.split(" ").slice(1).join(" ");
    const guild = message.guild!;
    const channelJoin = guild.channels.cache.find(chan => chan.name === arg)
    channelJoin && joinVoiceChannel({
      channelId:channelJoin.id,
      guildId:guild.id,
      adapterCreator:guild.voiceAdapterCreator
    })
  }
})
