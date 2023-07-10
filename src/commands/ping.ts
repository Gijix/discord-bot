import { Command } from "../handlers/commandHandler.js";

export default new Command({
  name: 'ping',
  description: 'get server time response',
  isSlash: true,
  async handler (interaction) {
    await interaction.reply({
      ephemeral: true,
      content: `client reply with ${this.ws.ping}`
    })
  }
})