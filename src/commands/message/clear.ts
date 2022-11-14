import { Message, Collection, PermissionsString, ChannelType } from "discord.js";
import { Command } from "../../commandHandler.js";

export default new Command({
  name: "clear",
  description: "Delete all message of current channel",
  permissions: ['ManageMessages'],
  async handler (message) {
    let messages: Collection<string, Message>

    if (message.channel.type === ChannelType.DM) return;

    do {
      messages = (await message.channel.messages.fetch({limit:100}))
      message.channel.bulkDelete(messages)
    } while (messages.size >= 2)
  }
})
