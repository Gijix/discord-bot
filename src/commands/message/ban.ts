import { Message, PermissionsString, Client } from "discord.js";

export function fn(message: Message, _bot: Client) {
  const parsedMsg = message.content.split(" ");
  const reason = parsedMsg.slice(2).join(" ");

  if (message.mentions.members!.size === 1) {
    message.mentions.members!.first()!.ban({
      reason: reason,
    });
  }
}

export const name = "ban";
export const permList: PermissionsString[] = ["BanMembers"];
export const description = "ban mentionned user";
