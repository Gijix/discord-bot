import { Command } from "../../commandHandler.js";

export default new Command({
  name: 'toggle',
  description: 'play the current song in a loop',
  async handler (message, bot) {
    const handler = bot.checkPlayerCondition(message)

    if (!handler) return

    handler.queue?.setPaused()
  }
})