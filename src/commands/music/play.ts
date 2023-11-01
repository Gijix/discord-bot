import { Command } from "../../handlers/commandHandler.js";

export default new Command({
  name: 'play',
  description: 'add a song to the server queue and init the queue',
  guildOnly: true,
  async handler (message) {
    const player = this.playerManager.ensure(message.guildId)
  
    await player.play(message.arguments[0], message.member)
  }
})
