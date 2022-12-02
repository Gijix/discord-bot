import { Command } from "../../commandHandler.js";

export default new Command({
  name: 'shuffle',
  description: 'shuffle the server queue',
  async handler (message, bot) {
    const handler = bot.checkPlayerCondition(message)

    if (!handler) return

    handler.queue?.shuffle()
  }
})