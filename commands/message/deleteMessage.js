const { Message, Permissions } = require("discord.js");
/**
 * @param {Message} msg
 */
function fn(msg) {
  let arr = msg.content.split(" ");
  try {
    if (isNaN(parseInt(arr[1]))) {
      let id = msg.mentions.members.first().id;

      if (msg.guild.members.cache.array().some((x) => x.id === id)) {
        msg.channel.messages
          .fetch()
          .then((messages) =>
            msg.channel
              .bulkDelete(messages.filter((mess) => mess.author.id === id))
              .catch(console.error)
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
const name = "delete";
/**
 * @type {Permissions}
 */
const permList = ["MANAGE_MESSAGES"];
const description = "Delete a number of message or all of specific user";
module.exports = { fn, name, permList, description };
