import { ChannelType } from "discord.js";
import { Command } from "../commandHandler.js";
import { error } from "../logger.js";
import { filename } from 'dirname-filename-esm'

const __filename = filename(import.meta)

export default new Command({
  name: 'delete',
  description: 'Delete a number of message or all of specific user',
  permissions: ["ManageMessages"],
  handler (message) {
    let arr = message.content.split(" ");
    if (message.channel.type === ChannelType.DM) return;
  
    try {
      if (isNaN(parseInt(arr[1]))) {
        let id = message.mentions.members!.first()!.id;
  
        if (message.guild!.members.cache.find(x => x.id === id)) {
          message.channel.messages
            .fetch()
            .then((messages) =>
              message.channel
                // .bulkDelete(messages.filter((mess) => mess.author.id === id))
                // .catch(console.error)
            );
        }
      } else {
        const num = parseInt(arr[1]);
        message.channel.bulkDelete(num + 1).catch((err) => console.error(err));
      }
    } catch (e) {
      error(e as string, __filename);
    }
  }
})
