import { Command, MessageCommand } from "../../handlers/commandHandler.js";
import { isNumeric } from "../../util/index.js";

export default new Command({
  name: 'seek',
  description: 'seek for a moment in the song',
  guildOnly: true,
  async handler (message) {
    const player = this.playerManager.ensure(message.guildId)
    const seekTime = message.arguments[0]

    if (!isNumeric(seekTime)) {
      message.reply('invalid seektime')
      return
    }

    await player.seek(message, parseInt(seekTime))
  }
})
