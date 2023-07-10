import { Command } from "../handlers/commandHandler.js";

export default new Command({
  name: 'lov',
  description: 'lov subCommand',
  handler (message) {
    message.reply('not implemented yet')
  }
})