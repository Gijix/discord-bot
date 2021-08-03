require("dotenv").config();
const Client = require("./customClient");
const bot = new Client();

const commandsMsg = require("./commands/message/index");
const commandVoice = require("./commands/voice/index");
const music = require("./music");

const prefix = "!";

bot.on("ready", () => {
  console.info("Orlando bot has started");
  bot.user.setStatus("available");
  bot.user.setPresence({
    status: "online",
    activity: {
      name: `<${prefix}commandName>`,
      type: "WATCHING",
    },
  });
});

bot.on("message", async (message) => {
  bot.logMsg(message, prefix);
  music(message, bot, prefix);
  if (message.author.bot) return;
  const parsedMsg = message.content.split(" ");
  commandsMsg.forEach((command) => {
    if (
      parsedMsg[0] === prefix + command.name &&
      bot.checkPerm(message, ["MANAGE_MESSAGES"])
    ) {
      command.fn(message, bot);
    }
  });
  
});

bot.on("messageDelete", async (messageDelete) => {
  bot.logDeleteMsg(messageDelete);
});

bot.on("messageUpdate", (oldMessage, newMessage) => {
  bot.logUpdateMsg(oldMessage, newMessage);
});

bot.on('guildMemberAdd', member =>{
  bot.logUserState(member)
})

bot.on("voiceStateUpdate", async (oldstate, newstate) => {
  bot.logVoiceUpdate(oldstate,newstate)
  commandVoice.forEach((command) => {
    command.fn(oldstate, newstate);
  });
});


bot.on("error", (error) => {
  console.info("The websocket connection encountered an error:", error);
});

bot.login(process.env.BOT_TOKEN);
