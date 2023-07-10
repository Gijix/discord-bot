import { Command } from "../../handlers/commandHandler.js";

export default new Command({
  name: 'toggle',
  description: 'play the current song in a loop',
  isActivated: false,
  async handler (message) {
  }
})