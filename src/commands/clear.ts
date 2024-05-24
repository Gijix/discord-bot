import { Message, Collection, ChannelType, ThreadChannel, ActionRow, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { Command } from "../handlers/commandHandler.js";
import { filename } from 'dirname-filename-esm'
import { error } from "../util/logger.js";

const __filename = filename(import.meta)

export default new Command({
  name: "clear",
  description: "Delete all message of current channel",
  permissions: ['ManageMessages'],
  async handler (message) {
    let messages: Collection<string, Message>

    if (message.channel.isDMBased()) return;

    try {
      do {
        messages = (await message.channel.messages.fetch({limit:100}))
        await message.channel.bulkDelete(messages)
      } while (messages.size >= 2)
    } catch(err){
      error(err, __filename)

      if(message.channel.isThread()) return

      await message.channel.clone()
      await message.channel.delete()
    }
  }
})
