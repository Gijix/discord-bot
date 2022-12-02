import { Command } from "../../commandHandler.js";

export default new Command({
  name: 'skip',
  description: 'skip the current song',
  async handler (message, bot) {
    const handler = bot.checkPlayerCondition(message)

    if (!handler) return

    handler.queue?.skip()
  }
})