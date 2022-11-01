import 'dotenv/config'
import { GatewayIntentBits, ActivityType } from 'discord.js'
const { Guilds, GuildMessages, GuildVoiceStates } = GatewayIntentBits
import Client from "./customClient";
const bot = new Client({ intents: [Guilds, GuildMessages, GuildVoiceStates] });

import commandsMsg from "./commands/message/index";
import commandVoice from "./commands/voice/index";
import help from "./help";
import { play, musicInfos } from './music';

const prefix = "$";

bot.on("ready", () => {
  console.info("Orlando bot has started");
  bot.user!.setStatus('idle');
  bot.user!.setPresence({
    status: "online",
    activities: [{
      name: `<${prefix}commandName>`,
      type:ActivityType.Watching,
    }],
  });
});

bot.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  // bot.logMsg(message, prefix);
  const command = message.content.split(" ")[0]
  if (command === prefix + help.name) {
    help.fn(message, bot, prefix);
  }
  musicInfos.forEach((com) => {
    if (command === prefix + com.name) {
      play(message, bot, prefix);
    }
  });
  
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
  if (newMessage.author!.bot) return;
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

bot.player.on('error',(err: any)=> console.error(err))

bot.on("error", (error) => {
  console.info("The websocket connection encountered an error:", error);
});

bot.login(process.env.BOT_TOKEN);
