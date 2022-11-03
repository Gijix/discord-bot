import { Message, Client, PermissionsString } from "discord.js";

export function fn(message: Message, bot: Client) {
  const parsedMsg = message.content.split(" ");
  const reason = parsedMsg.slice(2).join(" ");

  if (message.mentions.members!.size === 1) {
    message.mentions.members!.first()!.kick(reason);
  }
}

export const name = "kick";
export const permList: PermissionsString[] = ["KickMembers"];
export const description = "Kick mentionned user";
