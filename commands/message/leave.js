const { Message, Client, VoiceChannel } = require("discord.js");
const {getVoiceConnection} = require('@discordjs/voice')

/**
 * @param {Message} msg
 * @param {Client} bot
 */
function fn(msg, bot) {
  const connection = getVoiceConnection(msg.guild.id)
  connection && connection.destroy()
    }

const name = "leave";
/**
 * @type {Permissions}
 */
const permList = ["ADMINISTRATOR"];
const description = "Make the bot leave the current voice channel";
module.exports = { fn, name, permList, description };
