import { Command } from "../handlers/commandHandler.js";
import { setTimeout } from "timers/promises";

export default new Command({
  name: "reset",
  description: "restart the bot",
  permissions: ["Administrator"],
  async handler (message) {
    await message.reply("i will restart in 5 seconds")
    await setTimeout(5000)
    await this.destroy() 
    await this.login()
  }
})
