const {Message,VoiceChannel} = require('discord.js')
/**
 * 
 * @param {Message} msg 
 */
function fn(msg){
    let arg = msg.content.split(" ").slice(1).join(' ')
    console.log(arg);
    const {guild} = msg
    /**
     * @type {VoiceChannel}
     */
    const channelJoin = guild.channels.cache.array().find(chan => chan.name === arg)
     if(channelJoin){
        channelJoin.join()
    }
    else{
        return console.error("channel doesn't exist")
    }
}   
const name = "join"

module.exports =  {fn,name}