import { Command } from "../../commandHandler.js";

export default new Command({
  name: 'skip',
  description: 'skip the current song',
  isActivated: false,
  async handler (message) {
  }
})