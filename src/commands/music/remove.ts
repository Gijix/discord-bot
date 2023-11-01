import { Command } from "../../handlers/commandHandler.js";
import { isNumeric } from "../../util/index.js";

export default new Command({
  name: 'remove',
  description: 'remove a song from the queue by index',
  guildOnly: true,
  async handler (message) {
    const player = this.playerManager.ensure(message.guildId)

    const index = message.arguments[0]

    if (!isNumeric(index)) {
      message.reply('invalid index value')
    }

    player.queue.splice(parseInt(index), 1)
  }
})
