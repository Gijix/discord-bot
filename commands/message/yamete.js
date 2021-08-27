const { Message, Permissions } = require("discord.js");
const path = require("path")
/**
 * 
 * @param {Message} message 
 * @returns 
 */
function fn(message){
        if (!message.member.voice.channel || message.guild.me.voice.channel) return 
        message.member.voice.channel.join().then(vc => {
            vc.play(path.join(__dirname,'../../sounds/yamete.mp3')).on("finish", () => vc.disconnect());
        }).catch(console.error)
    };
/**
 * @type {Permissions} 
*/
const permList = ["ADMINISTRATOR"]
const name = "yamete"
const description = "Call the bot and says 'Yamete kudasai!!'"
module.exports={name,fn,description,permList}
