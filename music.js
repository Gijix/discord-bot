const { Message } = require("discord.js");
const Client = require("./customClient");
const { Song } = require("discord-music-player");
/**
 * @typedef info
 * @property {string} name
 * @property {string} description
 */
/**
 * @type {info[]}
 */
const musicInfos = [
  {
    name: "play",
    description: "add a song to the server queue and init the queue",
  },
  { name: "stop", description: "stop the current song and clear the server queue" },
  { name: "pause", description: "pause the current song" },
  { name: "resume", description: "resume the current song" },
  { name: "skip", description: "skip the current song" },
  { name: "toggle", description: "play the current song in a loop" },
  { name: "remove", description: "remove a song from the queue by index" },
  { name: "shuffle", description: "shuffle the server queue" },
  { name: "seek", description: "seek for a moment in the song" },
  { name: "playlist", description: "add playlist to the server queue and init the queue" },
];
/**
 *
 * @param {Message} message
 * @param {Client} bot
 * @param {string} prefix
 */

async function play(message, { player }, prefix) {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (!message.member.voice.channelID) return;
  /**
   * @type {Song}
   */
  let song = null;
  try {
    switch (command) {
      case "play" || "playlist":
        song = await player[command](message, {
          search: args.join(" "),
        });
        message.channel.send("playing : " + song.url);
        break;
      case "toggle":
        song = player.toggleLoop(message);
        break;
      case "remove":
        song = player.remove(message, parseInt(args[0]) - 1);
        break;
      case "seek":
        song = await player.seek(message, parseInt(args[0]) * 1000);
        break;
      default:
        song = player[command](message);
    }
  } catch (e) {
    console.error;
  }
}
module.exports = { play, musicInfos };
