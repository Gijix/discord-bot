import { Command } from "../../handlers/commandHandler.js";

export default new Command({
  name: 'skip',
  description: 'skip the current song',
  guildOnly: true,
  async handler (message) {
    const player = this.playerManager.ensure(message.guildId)

    player.skip(message)
  }
})
