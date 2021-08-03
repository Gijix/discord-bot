const  {Message, TextChannel} = require('discord.js')
/**
 * 
 * @param {Message} message 
 */
async function fn(message){
    let messages = (await message.channel.messages.fetch()).array()
    message
    .channel.bulkDelete(messages.length)

}

const name = "clear"

module.exports= {fn,name}