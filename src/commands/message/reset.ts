import { Message, Client, PermissionsString } from "discord.js";

export function fn(msg: Message, bot: Client) {
  msg.reply("i will restart in 5 seconds").then(() =>
    setTimeout(() => {
      bot.destroy() 
      bot.login(process.env.BOT_TOKEN)
    }, 5000)
  );
}

export const name = "reset";
export const permList: PermissionsString[] = ["Administrator"];
export const description = "restart the bot";
