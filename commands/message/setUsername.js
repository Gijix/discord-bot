const { Message, Client } = require("discord.js");
/**
 * @param {Message} msg
 * @param {Client} bot
 */
function fn(msg, bot) {
  const parsedMsg = msg.content.split(" ");
  if (parsedMsg.length > 2) {
    msg.reply("Use a name without space").then((msg) => msg.delete({timeout:2500}))
  } else {
    bot.user
      .setUsername(parsedMsg[1])
      .then(() =>
        msg
          .reply("bot name is now : " + parsedMsg[1])
          .then((message) => message.delete({timeout:2500}))
      );
  }
}
const name = "setUsername";

module.exports = {fn,name}
