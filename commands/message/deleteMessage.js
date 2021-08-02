const { Message } = require("discord.js");
/**
 * @param {Message} msg
 */
function fn(msg) {
  let arr = msg.content.split(" ");
  if (isNaN(parseInt(arr[1]))) {
    let id = msg.mentions.members.first().id;
    if (msg.guild.members.cache.array().some((x) => x.id === id)) {
      msg.channel.messages.fetch().then((messages) =>
        messages.forEach((mess) => {
          if (mess.author.id === id) {
            mess
              .delete()
              .then(() =>
                msg.reply("succesfuly delete message of user : " + id)
              )
              .then((msg) => msg.delete({timeout:2500}))
          }
        })
      );
    }
  } else {
    const num = parseInt(arr[1]);
    msg.channel.bulkDelete(num + 1).catch((err) => console.error(err));
    msg
      .reply(`Deleted ${num} message`)
      .then((msg) => msg.delete({timeout:2500}))
      .catch((err) => console.error(err));
  }
}
const name = "delete";
module.exports = { fn, name };
