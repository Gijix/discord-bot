const { Message, Client, VoiceChannel } = require("discord.js");
let leaved = false;
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
        leaved = true;
      } else {
        if (!leaved) {
          msg
            .reply("i'm not in a voiceChat")
            .then((mess) => setTimeout(() => mess.delete(), 2500));
        }
      }
    });
}

const name = "leave";
module.exports = { fn, name };
