import { getVoiceConnection } from '@discordjs/voice';
import { Command } from "../handlers/commandHandler.js";

export default new Command({
  name: "leave",
  description: "Make the bot leave the current voice channel",
  permissions: ['Administrator'],
  async handler (message) {
    const connection = getVoiceConnection(message.guild!.id)
    connection && connection.destroy()
  }
})
