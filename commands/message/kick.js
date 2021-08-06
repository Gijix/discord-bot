const { Message, Client, Permissions } = require("discord.js");
/**
 *
 * @param {Message} message
 * @param {Client} bot
 */

function fn(message, bot) {
  const parsedMsg = message.content.split(" ");
  const reason = parsedMsg.slice(2).join(" ");

  if (message.mentions.members.size === 1) {
    message.mentions.members.first().kick(reason);
  }
}

const name = "kick";
/**
 * @type {Permissions}
 */
const permList = ["KICK_MEMBERS"];
const description = "Kick mentionned user";

module.exports = { fn, name, permList, description };
