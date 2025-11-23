import { ActivityType } from "discord.js";
import { EventListener } from "../handlers/EventHandler.js";
import { success } from "../util/logger.js";

export default new EventListener({
  name: 'clientReady',
  async listener() {
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
