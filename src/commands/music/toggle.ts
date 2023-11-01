import { Command } from "../../handlers/commandHandler.js";

export default new Command({
  name: 'toggle',
  description: 'play the current song in a loop',
  guildOnly: true,
  async handler (message) {
    const player = this.playerManager.ensure(message.guildId)

    player.isLooping = !player.isLooping
  }
})
