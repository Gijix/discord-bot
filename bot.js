require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

const prefix = '!';

bot.on('ready', () => {
  console.info('Orlando bot has started');
  bot.user.setStatus('available');
  bot.user.setPresence({ status: 'online', activity: { name: '!<commandname>', type: 'WATCHING' } });
});

bot.on('message', async (message) => {
  const guild = message.guild;

  if (firstMentionGuildMember && message.content.startsWith(prefix + 'matchwith')) {
    message.react('✅');
    message.react('❌');

    try {
      const reactions = await message.awaitReactions(
        (reaction, user) => user.id === firstMentionGuildMember.user.id && reaction.emoji.name === '✅',
        {
          max: 30,
        }
      );
      console.log(reactions);
      if (reactions.first().emoji.name === '✅') {
        const firstRoleName = message.author.username;
        const secondRoleName = firstMentionGuildMember.user.username;
        console.log(`inside condition ${firstRoleName} ${secondRoleName}`);
        // guild.roles.create({
        //   data: {
        //     name: firstRoleName,
        //     color: 'BLUE',
        //   },
        // });
        // guild.roles.create({
        //   data: {
        //     name: secondRoleName,
        //     color: 'RED',
        //   },
        // });

        console.log('it worked');
      }
    } catch (error) {
      console.log(error);
    }
  }
  // const messageArr = message.content.split(' ');
  // const amount = parseInt(messageArr[1]);
  // console.log(amount);
  // console.log(message.channel);
  // if (message.content.startsWith(prefix + 'clear') && messageArr.length === 2) {
  //   message.channel.bulkDelete(amount).catch(console.error);
  // }
});

process.on('unhandledRejection', (error) => {
  throw new Error('Unhandled promise rejection:', error);
});

bot.on('error', (error) => {
  console.info('The websocket connection encountered an error:', error);
});

bot.login(process.env.BOT_TOKEN);
