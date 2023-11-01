import { EventListener } from "../handlers/EventHandler.js";

export default new EventListener({
  name: 'guildCreate',
  async listener (guild) {
    await this.deployCommands(guild.id)
  }
})
