import { setTimeout } from "timers/promises";
import { Command } from "../commandHandler.js";

export default new Command({
  name: "setBotname",
  description: "Set the bot name",
  permissions: ["Administrator"],
  async handler (message) {
    const parsedMsg = message.content.split(" ");
    if (parsedMsg.length > 1) {
      await message
        .replyDefer("Use a name without space")
        .then((msg) => msg.deferDelete(2000));
    } else {
      await this.user!.setUsername(parsedMsg[1]);
    }
  }
})

