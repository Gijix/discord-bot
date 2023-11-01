import { Command } from "../../handlers/commandHandler.js";

export default new Command({
  name: 'pause',
  description: 'pause the current song',
  guildOnly: true,
  async handler (message) {
    const player = this.playerManager.ensure(message.guildId)

    player.pause(message)
  }
})
