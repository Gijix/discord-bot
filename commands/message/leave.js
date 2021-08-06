const { Message, Client, VoiceChannel } = require("discord.js");

/**
 * @param {Message} msg
 * @param {Client} bot
 */
function fn(msg, bot) {
  msg.guild.channels.cache
    .array()
    .filter((chan) => chan.type === "voice")
    .forEach((chan) => {
      if (chan.members.find(({ id }) => id === bot.user.id)) {
        /**
         * @type {VoiceChannel}
         */
        const chanLeave = chan;
        chanLeave.leave();
      } else {
        return;
      }
    });
}

const name = "leave";
/**
 * @type {Permissions}
 */
const permList = ["ADMINISTRATOR"];
const description = "Make the bot leave the current voice channel";
module.exports = { fn, name, permList, description };
