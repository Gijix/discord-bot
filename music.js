const { Message } = require("discord.js");
const Client = require("./customClient");
const { RepeatMode } = require("discord-music-player");
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
  {name:"getqueue"},
  {
    name: "stop",
    description: "stop the current song and clear the server queue",
  },
  { name: "pause", description: "pause the current song" },
  { name: "resume", description: "resume the current song" },
  { name: "skip", description: "skip the current song" },
  { name: "toggle", description: "play the current song in a loop" },
  { name: "remove", description: "remove a song from the queue by index" },
  { name: "shuffle", description: "shuffle the server queue" },
  { name: "seek", description: "seek for a moment in the song" },
  {
    name: "playlist",
    description: "add playlist to the server queue and init the queue",
  },
];
/**
 *
 * @param {Message} message
 * @param {Client} bot
 * @param {string} prefix
 */

async function play(message, { player }, prefix) {
  const isOnvoice = message.member.voice.channelId;
  const botOnVoice = message.guild.me.voice.channelId;
  if (!isOnvoice || (botOnVoice && isOnvoice !== botOnVoice)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  let guildQueue = player.getQueue(message.guild.id);
  console.log({command});
  switch (command) {
    case "play" || "playlist":
      let queue = player.createQueue(message.guild.id);
      await queue.join(message.member.voice.channel);
      let song = await queue[command](args.join(" ")).catch((_) => {
        if (!guildQueue) queue.stop();
      });
      break;
    case "skip" :
      let skippedSong = guildQueue.skip()
    break
    case "stop":
      guildQueue.stop();
    break
    case "pause":
      guildQueue.setPaused();
    break
    case "resume":
      guildQueue.setPaused(false);
    break
    case "seek":
      guildQueue.seek(parseInt(args.join(' ')) * 1000);
    break
    case "getqueue":
      console.log({guildQueue})
    break
    default:
      console.log("default");
    break
  }
}
module.exports = { play, musicInfos };
