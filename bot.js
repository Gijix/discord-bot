require("dotenv").config();
const Discord = require("discord.js");
const bot = new Discord.Client();

const prefix = "!";

bot.on("ready", () => {
  console.info("Orlando bot has started");
  bot.user.setStatus("available");
  bot.user.setPresence({
    status: "online",
    activity: { name: "!<commandname>", type: "WATCHING" },
  });
});

bot.on("message", async (message) => {
  const guild = message.guild;
  const firstMentionGuildMember = message.mentions.members.first();
  console.log("STEP 1");

  if (
    firstMentionGuildMember &&
    message.content.startsWith(prefix + "matchwith")
  ) {
    message.react("✅");
    message.react("❌");
    const filter = (reaction, user) => reaction.emoji.name === "✅";

    let collector = message.createReactionCollector(filter, { max: 30 });
    collector.on("collect", (reaction, user) => {
      if (user.id === firstMentionGuildMember.user.id) {
        console.log("It worked");
        const firstRoleName = message.author.username;
        const secondRoleName = firstMentionGuildMember.user.username;
        guild.roles.create({
          data: {
            name: firstRoleName,
            color: "BLUE",
          },
        }).then;

        guild.roles.create({
          data: {
            name: secondRoleName,
            color: "RED",
          },
        });
        setTimeout(function () {
          
            const role1 = guild.roles.cache.filter((r) => r.name === firstRoleName)
            const role2 = guild.roles.cache.filter((r) => r.name === secondRoleName)
            message.member.roles.add(role2)
            firstMentionGuildMember.roles.add(role1)


          ;
        }, 1000);
        // let role1 = guild.roles.cache.array().find((r) => r.name === firstRoleName);
        // let role2 = guild.roles.cache.array().find((r) => r.name === secondRoleName);
        // console.log(role1);
        // console.log(role2)

        // message.member.roles.add(role2);
        // message.mentions.members.first().roles.add(role1);
        // message.delete();
      }
    });
    // const messageArr = message.content.split(' ');
    // const amount = parseInt(messageArr[1]);
    // console.log(amount);
    // console.log(message.channel);
    // if (message.content.startsWith(prefix + 'clear') && messageArr.length === 2) {
    //   message.channel.bulkDelete(amount).catch(console.error);
    // }
  }
});

process.on("unhandledRejection", (error) => {
  throw new Error("Unhandled promise rejection:", error);
});

bot.on("error", (error) => {
  console.info("The websocket connection encountered an error:", error);
});

bot.login(process.env.BOT_TOKEN);
