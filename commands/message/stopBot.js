const { Message, Client } = require("discord.js");
/**
 *
 * @param {Message} msg
 * @param {Client} bot
 */
function fn(msg, bot) {
  msg.reply("i will disconnect in 5 seconds").then(() => setTimeout(() => {
    bot.destroy()
  }, (5000)));
}
const name = "stopBot";

module.exports = { fn, name };
