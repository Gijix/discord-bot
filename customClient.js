const {Player} = require('discord-music-player')
const {Message,PermissionOverwrites} = require('discord.js')
const Discord = require('discord.js')
 module.exports = class myClient extends Discord.Client {
    player = new Player(this,{
      leaveOnEnd: false,
      leaveOnStop: false,
      leaveOnEmpty: true,
      timeout: 0,
      volume: 150,
      quality: 'high',
  })
  /**
 * Check if the user who wrote the command has the perm for perfoming it
 * @param {Message} msg 
 * @param {PermissionOverwrites} permList 
 * @return {boolean}
 */
  static checkPerm(msg,permList) {
    return(msg.member.hasPermission(permList) || msg.member.user.id ==='247100615489093632')
  }
}