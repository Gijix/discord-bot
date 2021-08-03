const { Message } = require("discord.js");
/**
 * @param {Message} msg
 */
function fn(msg) {
  let arr = msg.content.split(" ");
  if (isNaN(parseInt(arr[1]))) {
    let id = msg.mentions.members.first().id;
    if (msg.guild.members.cache.array().some((x) => x.id === id)) {
      msg.channel.messages
        .fetch()
        .then((messages) =>
          msg.channel.bulkDelete(
            messages
              .filter((mess) => mess.author.id === id)
          ).then()
        );
    }
  } else {
    const num = parseInt(arr[1]);
    msg.channel.bulkDelete(num + 1).catch((err) => console.error(err))
  }
}
const name = "delete";
module.exports = { fn, name };
