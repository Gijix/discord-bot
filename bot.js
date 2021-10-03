require("dotenv").config();
const {Intents} = require('discord.js')
const Client = require("./customClient");
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_VOICE_STATES] });

const commandsMsg = require("./commands/message/index");
const commandVoice = require("./commands/voice/index");
const help = require("./help");
const { play, musicInfos } = require("./music");

const prefix = "$";

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
bot.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  // bot.logMsg(message, prefix);
  const command = message.content.split(" ")[0]
  if (command === prefix + help.name) {
    help.fn(message,bot,prefix);
  }
  musicInfos.forEach((com) => {
    if (command === prefix + com.name) {
      play(message, bot, prefix);
    }
  });
  // if(message.content.startsWith(prefix+"play")){
  // console.log("message valid");
  // require('./customPlayer').play(message,prefix,bot)
  // }
  
  commandsMsg.forEach((com) => {
    if (
      command === prefix + com.name &&
      bot.checkPerm(message, com.permList)
    ) {
      com.fn(message, bot);
    }
  });
});

bot.on("messageDelete", async (messageDelete) => {
  // bot.logDeleteMsg(messageDelete);
});

bot.on("messageUpdate", (oldMessage, newMessage) => {
  if (newMessage.author.bot) return;
  // bot.logUpdateMsg(oldMessage, newMessage);
});

bot.on("guildMemberAdd", (member) => {
  // bot.logUserState(member);
});

bot.on("guildMemberRemove",(member) => {
  // bot.logUserState(member)
})

bot.on("voiceStateUpdate", async (oldstate, newstate) => {
  // bot.logVoiceUpdate(oldstate, newstate);
  commandVoice.forEach((command) => {
    command.fn(oldstate, newstate);
  });
});

bot.player.on('error',(err,queue)=> console.error(err))

bot.on("error", (error) => {
  console.info("The websocket connection encountered an error:", error);
});

bot.login(process.env.BOT_TOKEN);
