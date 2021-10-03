const { Message, Permissions } = require("discord.js");
const Client = require('../../customClient')
const {createAudioResource,createAudioPlayer,AudioPlayerStatus,getVoiceConnection, NoSubscriberBehavior} = require('@discordjs/voice')
const path = require("path");
const { join } = require("path");
/**
 * 
 * @param {Message} message 
 * @param {Client} bot
 * @returns 
 */
function fn(message,bot){
        if (!message.member.voice.channel || message.guild.me.voice.channel) return 
        const connection = getVoiceConnection(message.guildId) || bot.join(message)
        const {player} = connection.subscribe(createAudioPlayer({
            behaviors:NoSubscriberBehavior.Pause
        }))
        const audioRessourse = createAudioResource(path.join(__dirname,"../../sounds/yamete.mp3"))
        player.play(audioRessourse)
        player.on(AudioPlayerStatus.Idle ,() => {
            connection.destroy()
        })
        
    }
/**
 * @type {Permissions} 
*/
const permList = ["ADMINISTRATOR"]
const name = "yamete"
const description = "Call the bot and says 'Yamete kudasai!!'"
module.exports={name,fn,description,permList}
