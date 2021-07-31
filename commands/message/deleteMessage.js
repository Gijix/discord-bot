const { Message, GuildAuditLogsEntry } = require("discord.js");
/**
 * @param {Message} msg
 */
function fn(msg) {
  const { guild } = msg;
  let arr = msg.content.split(" ");
  if (isNaN(parseInt(arr[1]))) {
    let id = msg.mentions.members.first().id;
    console.log(id);
    if (msg.guild.members.cache.array().some((x) => x.id === id)) {
      console.log("there is a user");
      msg.channel.messages.fetch().then((messages) =>
        messages.forEach((mess) => {
          if (mess.author.id === id) {
            console.log("gonna delete");
            mess
              .delete()
              .then(() =>
                msg.reply("succesfuly delete message of user : " + id)
              )
              .then((msg) => setTimeout(msg.delete(), 2500));
          }
        })
      );
    }
  } else {
    const num = parseInt(arr[1]);
    msg.channel.bulkDelete(num + 1).catch((err) => console.error(err));
    console.log(`succesfuly deleted ${num}`);
    msg
      .reply(`Deleted ${num} message`)
      .then((msg) => setTimeout(() => msg.delete(), 2500))
      .catch((err) => console.error(err));
  }
}
const name = "delete";
module.exports = { fn, name };
