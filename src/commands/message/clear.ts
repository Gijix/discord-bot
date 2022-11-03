import { Message, Collection, PermissionsString, ChannelType } from "discord.js";

export async function fn(message: Message) {
  let messages: Collection<string, Message>

  if (message.channel.type === ChannelType.DM) return;

  do {
    messages = (await message.channel.messages.fetch({limit:100}))
    message.channel.bulkDelete(messages)
  } while (messages.size >= 2)
}

export const name = "clear";
export const permList: PermissionsString[] = ["ManageMessages"];
export const description = "Delete all message of current channel";
