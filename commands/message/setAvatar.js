const { Message, Client } = require("discord.js");
/**
 *
 * @param {Message} message
 * @param {Client} bot
 */
function fn(message, bot) {
  if (!message.attachments.first()) return;
  bot.user.avatarURL(message.attachments.first());
}
const name = "setAvatar";
module.exports = { fn, name };
