import { EventListener } from "../handlers/EventHandler.js";
import { error } from "../logger.js";

export default new EventListener({
  name: 'messageCreate',
  async listener(message) {
    if (message.author.bot) return;

    await this.commandHandler.runMessage(message, this).catch((e) => error(e, __filename))
  }
})