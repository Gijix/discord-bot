import { Command } from "../../commandHandler.js";

export default new Command({
  name: 'seek',
  description: 'seek for a moment in the song',
  async handler (message, bot) {
    const handler = bot.checkPlayerCondition(message)

    if (!handler) return

    await handler.queue?.seek(parseInt(message.arguments[0]))
  }
})