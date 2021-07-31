require("dotenv").config();
const Discord = require("discord.js");
const bot = new Discord.Client();

const commandsMsg = require("./commands/message/index");
const commandVoice = require("./commands/voice/index");

const prefix = "!";


bot.on("ready", () => {
  console.info("Orlando bot has started");
  bot.user.setStatus("available");
  bot.user.setPresence({
    status: "online",
    activity: {
      name: "!<commandname>",
      type: "WATCHING",
    },
  });
});
bot.on("message", async (message) => {
  commandsMsg.forEach((command) => {
    if (message.content.split(" ")[0] === prefix + command.name) {
      command.fn(message);
    }
  });
});

bot.on('voiceStateUpdate',async(oldstate,newstate) => {
  commandVoice.forEach(command => {
    command.fn(oldstate,newstate)
  })
})

bot.on("error", (error) => {
  console.info("The websocket connection encountered an error:", error);
});

bot.login(process.env.BOT_TOKEN);
