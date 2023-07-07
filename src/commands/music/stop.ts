import { Command } from "../../commandHandler.js";

export default new Command({
  name: 'stop',
  description: 'stop the current song and clear the server queue',
  isActivated: false,
  async handler (message) {
  }
})