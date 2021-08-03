const { Message } = require("discord.js");
const Client = require('./customClient')
/**
 *
 * @param {Message} message
 * @param {Client} bot
 * @param {string} prefix
 */
module.exports = async function (message,bot, prefix) {
  const parsedMsg = message.content.trim().split(" ");
  if (
    message.author.bot ||
    !message.member.voice.channelID ||
    !parsedMsg[0].startsWith(prefix)
  )
    return;
  const [play, stop, pause, resume, toggle] = [
    "play",
    "stop",
    "pause",
    "resume",
    "toggle",
  ];
  try {
    switch (parsedMsg[0].slice(1, parsedMsg[0].length)) {
      case play:
        let song = await bot.player.play(message, parsedMsg[1]);
        break;
      case pause:
        song = bot.player.pause(message);
        break;
      case resume:
        song = bot.player.resume(message);
        break;
      case stop:
        song = bot.player.stop(message);
        break;
      case toggle:
        song = bot.player.toggleLoop(message);
        if (toggle === null) return;
        break;
      default:
    }
  } catch (error) {
    console.error(error);
  }
};
