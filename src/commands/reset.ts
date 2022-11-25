import { Command } from "../commandHandler.js";
import { setTimeout } from "timers/promises";

export default new Command({
  name: "reset",
  description: "restart the bot",
  permissions: ["Administrator"],
  async handler (message, bot) {
    await message.reply("i will restart in 5 seconds")
    await setTimeout(5000)
    bot.destroy() 
    await bot.login(process.env.BOT_TOKEN)
  }
})
