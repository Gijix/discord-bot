import { EventListener } from "../handlers/EventHandler.js";
import { error } from "../util/logger.js";
import { filename } from 'dirname-filename-esm';

const __filename = filename(import.meta)

export default new EventListener({
  name: 'messageCreate',
  async listener(message) {
    if (message.author.bot) return;
    if (!message.inGuild()) return

    await this.commandHandler.runMessage(message, this).catch((e) => error(e, __filename, true))
  }
})
