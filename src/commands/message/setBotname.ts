import { Message, Client, PermissionsString } from "discord.js";
import { wait } from "../../utils.js";

export function fn(msg: Message, bot: Client) {
  const parsedMsg = msg.content.split(" ");
  if (parsedMsg.length > 2) {
    msg
      .reply("Use a name without space")
      .then((msg) => wait(2500).then(() => msg.delete()));
  } else {
    bot.user!.setUsername(parsedMsg[1]);
  }
}
export const name = "setBotname";
export const permList: PermissionsString[] = ["Administrator"];
export const description = "Set the bot name";
