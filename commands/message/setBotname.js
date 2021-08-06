const { Message, Client, Permissions } = require("discord.js");
/**
 * @param {Message} msg
 * @param {Client} bot
 */
function fn(msg, bot) {
  const parsedMsg = msg.content.split(" ");
  if (parsedMsg.length > 2) {
    msg
      .reply("Use a name without space")
      .then((msg) => msg.delete({ timeout: 2500 }));
  } else {
    bot.user.setUsername(parsedMsg[1]);
  }
}
const name = "setBotname";
/**
 * @type {Permissions}
 */
const permList = ["ADMINISTRATOR"];
const description = "Set the bot name";
module.exports = { fn, name, permList, description };
