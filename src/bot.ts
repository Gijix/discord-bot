import 'dotenv/config'
import { GatewayIntentBits, ActivityType, Events } from 'discord.js'
import Client from "./customClient.js";

const { Guilds, GuildMessages, GuildVoiceStates, MessageContent } = GatewayIntentBits
const bot = new Client({ intents: [Guilds, GuildMessages, GuildVoiceStates, MessageContent]});

import commandVoice from "./commands/voice/index.js";
import { play, musicInfos } from './music.js';

const prefix = process.env.PREFIX!;

bot.on(Events.ClientReady, async () => {
  console.info("Orlando bot has started");
  bot.user!.setStatus('idle');
  bot.user!.setPresence({
    status: "online",
    activities: [{
      name: `<${prefix}commandName>`,
      type:ActivityType.Watching,
    }],
  });
  await bot.commandHandler.loadCommands()
});

bot.on(Events.InteractionCreate, (interaction) => {
  if (interaction.isChatInputCommand()) {
      bot.commandHandler.runSlash(interaction, bot)
  }
})

bot.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  // bot.logMsg(message, prefix);
  const command = message.content.split(" ")[0]

  musicInfos.forEach((com) => {
    if (command === prefix + com.name) {
      play(message, bot, prefix);
    }
  });

  bot.commandHandler.runMessage(message, bot)
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
