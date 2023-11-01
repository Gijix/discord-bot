import { Command } from "../../handlers/commandHandler.js";

export default new Command({
  name: 'stop',
  description: 'stop the current song and clear the server queue',
  guildOnly: true,
  async handler (message) {
    const player = this.playerManager.ensure(message.guildId)

    player.stop(message)
  }
})
