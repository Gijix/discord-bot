const Discord = require("discord.js")
const config = require("./config.json")
const bot = new Discord.Client()



const prefix = '!'



bot.on('message', message => {
  const guild1 = message.guild
  const userlist = guild1.members.cache.array()
  
  
    const user1 = message.mentions.members.array()
    
  
    if(message.content.startsWith(prefix + "matchwith") && userlist.includes(user1[0])){
        message.react('✅')
        message.react('❌')
        message.awaitReactions((reaction, user) => user.id === user1[0].user.id && (reaction.emoji.name === '✅'),
                            { max: 30 }).then(collected => {
                                    if (collected.first().emoji.name === '✅') {
                                      
                                      const rolename1 = message.author.username
                                      const rolename2 = user1[0].user.username
                                        console.log(message.author.username)
                                        message.guild.roles.create({
                                            data: {
                                                name: rolename1,
                                                color: 'BLUE',
                                          }
                                        })
                                        message.guild.roles.create({
                                          data: {
                                                name :rolename2,
                                                color: 'RED',
                                          }
                                        })

                                      

                                      console.log("it worked")
                                    }})
    }
    const messageArr = message.content.split(' ')
    const amount = parseInt(messageArr[1])
    console.log(amount)
    console.log(message.channel)
    if(message.content.startsWith(prefix + "clear") && messageArr.length === 2 ){
      message.channel.bulkDelete(amount)
      .catch(console.error);
    }
  })





bot.login(config.BOT_TOKEN)