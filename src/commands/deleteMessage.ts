import { Command } from "../handlers/commandHandler.js";
import { error } from "../logger.js";
import { filename } from 'dirname-filename-esm'

const __filename = filename(import.meta)

export default new Command({
  name: 'delete',
  description: 'Delete a number of message or all of specific user',
  permissions: ["ManageMessages"],
  async handler (message) {
    let arr = message.arguments
  
    try {
      if (isNaN(parseInt(arr[1]))) {
        let id = message.mentions.members!.first()!.id;
  
        if (message.guild!.members.cache.find(x => x.id === id)) {
          await message.channel.messages
            .fetch()
            .then((messages) =>
              message.channel
                // .bulkDelete(messages.filter((mess) => mess.author.id === id))
                // .catch(console.error)
            );
        }
      } else {
        const num = parseInt(arr[1]);
        await message.channel.bulkDelete(num + 1).catch((err: Error | string) => error(err, __filename));
      }
    } catch (e) {
      error(e, __filename);
    }
  }
})
