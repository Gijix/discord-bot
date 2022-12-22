import { Command } from "../../commandHandler.js";

export default new Command({
  name: 'pause',
  description: 'pause the current song',
  async handler (message) {
    const handler = this.checkPlayerCondition(message)

    if (!handler) return

    handler.queue?.setPaused()
  }
})