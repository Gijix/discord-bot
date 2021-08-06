const { Message, Client, Permissions } = require("discord.js");
/**
 *
 * @param {Message} msg
 * @param {Client} bot
 */
function fn(msg, bot) {
  msg.reply("i will restart in 5 seconds").then(() =>
    setTimeout(() => {
      bot.destroy().then(() => bot.login(process.env.BOT_TOKEN));
    }, 5000)
  );
}
const name = "reset";
/**
 * @type {Permissions}
 */
const permList = ["ADMINISTRATOR"];
const description = "restart the bot";
module.exports = { fn, name, permList, description };
