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
      if (chan.members.find((member) => member.id === bot.user.id)) {
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
module.exports = { fn, name };
