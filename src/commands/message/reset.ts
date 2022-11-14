import { Command } from "../../commandHandler.js";

export default new Command({
  name: "reset",
  description: "restart the bot",
  permissions: ["Administrator"],
  handler (message, bot) {
    message.reply("i will restart in 5 seconds").then(() =>
    setTimeout(() => {
      bot.destroy() 
      bot.login(process.env.BOT_TOKEN)
    }, 5000)
  );
  }
})
