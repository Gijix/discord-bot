import { ActivityType } from "discord.js";
import { EventListener } from "../handlers/EventHandler.js";
import { success } from "../logger.js";

export default new EventListener({
  name: 'ready',
  async listener(client) {
    this.user.setStatus('idle');
    this.user.setPresence({
      status: "online",
      activities: [{
        name: `<${this.prefix}commandName>`,
        type: ActivityType.Watching,
      }],
    });
    success("Zebi bot has started");
  }
})