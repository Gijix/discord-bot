import { Command } from "../../commandHandler.js";

export default new Command({
  name: 'remove',
  description: 'remove a song from the queue by index',
  async handler (message, bot) {
    const handler = bot.checkPlayerCondition(message)

    if (!handler) return

    handler.queue?.remove(parseInt(message.arguments[0]))
  }
})