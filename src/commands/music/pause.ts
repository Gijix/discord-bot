import { Command } from "../../handlers/commandHandler.js";

export default new Command({
  name: 'pause',
  description: 'pause the current song',
  isActivated: false,
  async handler (message) {
  }
})