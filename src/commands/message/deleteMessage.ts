import { Message, PermissionsString, ChannelType } from "discord.js";

export function fn(msg: Message) {
  let arr = msg.content.split(" ");
  if (msg.channel.type === ChannelType.DM) return;

  try {
    if (isNaN(parseInt(arr[1]))) {
      let id = msg.mentions.members!.first()!.id;

      if (msg.guild!.members.cache.find(x => x.id === id)) {
        msg.channel.messages
          .fetch()
          .then((messages) =>
            msg.channel
              // .bulkDelete(messages.filter((mess) => mess.author.id === id))
              // .catch(console.error)
          );
      }
    } else {
      const num = parseInt(arr[1]);
      msg.channel.bulkDelete(num + 1).catch((err) => console.error(err));
    }
  } catch (e) {
    console.error;
  }
}

export const name = "delete";
export const permList: PermissionsString[] = ["ManageMessages"];
export const description = "Delete a number of message or all of specific user";
