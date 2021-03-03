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
  const { guild } = message;
  if (message.mentions.members) {
    const firstMentionGuildMember = message.mentions.members.first();

    if (
      firstMentionGuildMember &&
      message.content.startsWith(prefix + "matchwith")
    ) {
      message.react("✅");
      message.react("❌");
      const filterA = (reaction, user) => reaction.emoji.name === "✅";
      const filterB = (reaction, user) => reaction.emoji.name === "❌";

      let collectorA = message.createReactionCollector(filterA, { max: 30 });
      let collectorB = message.createReactionCollector(filterA, { max: 30 });
      collectorA.on("collect", (reaction, user) => {
        if (user.id === firstMentionGuildMember.user.id) {
          const firstRoleName = message.author.username;
          const secondRoleName = firstMentionGuildMember.user.username;
          const role1 = guild.roles.cache.find((r) => r.name === firstRoleName);
          const role2 = guild.roles.cache.find(
            (r) => r.name === secondRoleName
          );
          if (role1 === undefined) {
            console.log("LAST STEP");
            guild.roles.create({
              data: {
                name: firstRoleName,
                color: "BLUE",
              },
            });
          }
          if (role2 === undefined) {
            console.log("LAST STEP 2");
            guild.roles.create({
              data: {
                name: secondRoleName,
                color: "RED",
              },
            });
          }
          setTimeout(function () {
            message.member.roles.add(role2);
            firstMentionGuildMember.roles.add(role1);
          }, 1000);
        }
      });
      collectorB.on;
      // const messageArr = message.content.split(' ');
      // const amount = parseInt(messageArr[1]);
      // console.log(amount);
      // console.log(message.channel);
      // if (message.content.startsWith(prefix + 'clear') && messageArr.length === 2) {
      //   message.channel.bulkDelete(amount).catch(console.error);
      // }
    }
  }
});

process.on("unhandledRejection", (error) => {
  throw new Error("Unhandled promise rejection:", error);
});

bot.on("error", (error) => {
  console.info("The websocket connection encountered an error:", error);
});

bot.login(process.env.BOT_TOKEN);
