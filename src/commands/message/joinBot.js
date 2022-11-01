const { Message , Permissions } = require("discord.js");
const {joinVoiceChannel,a} = require('@discordjs/voice')
/**
 *
 * @param {Message} msg
 */
function fn(msg) {
  let arg = msg.content.split(" ").slice(1).join(" ");
  const { guild } = msg;
  const channelJoin = guild.channels.cache.find(chan => chan.name === arg)
  channelJoin && joinVoiceChannel({
    channelId:channelJoin.id,
    guildId:guild.id,
    adapterCreator:guild.voiceAdapterCreator
  })
  
}
const name = "join";
/**
 * @type {Permissions}
 */
const permList = ["ADMINISTRATOR"];
const description = "Make the bot join current voice channel";
module.exports = { fn, name, permList, description };
