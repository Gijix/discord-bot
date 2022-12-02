import { Command } from "../../commandHandler.js";

export default new Command({
  name: 'stop',
  description: 'stop the current song and clear the server queue',
  async handler (message, bot) {
    const handler = bot.checkPlayerCondition(message)

    if (!handler) return

    handler.queue?.stop()
  }
})