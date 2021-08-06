const { Message, VoiceChannel, Permissions } = require("discord.js");
/**
 *
 * @param {Message} msg
 */
function fn(msg) {
  let arg = msg.content.split(" ").slice(1).join(" ");
  const { guild } = msg;
  /**
   * @type {VoiceChannel}
   */
  const channelJoin = guild.channels.cache
    .array()
    .find((chan) => chan.name === arg);
  if (channelJoin) {
    channelJoin.join();
  } else {
    return console.error("channel doesn't exist");
  }
}
const name = "join";
/**
 * @type {Permissions}
 */
const permList = ["ADMINISTRATOR"];
const description = "Make the bot join current voice channel";
module.exports = { fn, name, permList, description };
