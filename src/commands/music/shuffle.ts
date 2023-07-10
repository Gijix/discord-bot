import { Command } from "../../handlers/commandHandler.js";

export default new Command({
  name: 'shuffle',
  description: 'shuffle the server queue',
  isActivated: false,
  async handler (message) {
  }
})