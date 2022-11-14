import { setTimeout } from "timers/promises";
import { Command } from "../../commandHandler.js";


export default new Command({
  name: "setBotname",
  description: "Set the bot name",
  permissions: ["Administrator"],
  async handler (message, bot) {
    const parsedMsg = message.content.split(" ");
  if (parsedMsg.length > 1) {
    message
      .reply("Use a name without space")
      .then((msg) => setTimeout(2500).then(() => msg.delete()));
  } else {
    await bot.user!.setUsername(parsedMsg[1]);
  }
  }
})

