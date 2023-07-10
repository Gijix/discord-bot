import { Command } from "../../handlers/commandHandler.js";
import { filename } from 'dirname-filename-esm';


const __filename = filename(import.meta)

export default new Command({
  name: 'play',
  description: 'add a song to the server queue and init the queue',
  async handler (message) {
    const player = this.playerManager.ensure(message.guildId)

    player.play(message.arguments[0], message.member)
    
  }
})
