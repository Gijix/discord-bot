import 'dotenv/config'
import { GatewayIntentBits, ActivityType, Events } from 'discord.js'
import Client from "./customClient.js";
import { error, success } from './logger.js';
import { filename } from 'dirname-filename-esm'

const __filename = filename(import.meta)


const { Guilds, GuildMessages, GuildVoiceStates, MessageContent } = GatewayIntentBits
const bot = new Client({ intents: [Guilds, GuildMessages, GuildVoiceStates, MessageContent]});

import { play, musicInfos } from './music.js';

const prefix = process.env.PREFIX!;

bot.on(Events.ClientReady, async () => {
  success("Orlando bot has started");
  bot.user!.setStatus('idle');
  bot.user!.setPresence({
    status: "online",
    activities: [{
      name: `<${prefix}commandName>`,
      type:ActivityType.Watching,
    }],
  });
  
});

bot.on(Events.InteractionCreate, (interaction) => {
  if (interaction.isChatInputCommand()) {
      bot.commandHandler.slashs.get(interaction.commandName)?.handler(interaction, bot)
  }

  if (interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand()) {
    bot.contextMenuHandler.runUserContextMenuInteraction(interaction, bot) 
  }

  if (interaction.isModalSubmit()) {
    bot.modalHandler.onSubmit(interaction, bot)
  }
})

bot.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  // bot.logMsg(message, prefix);

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
});

bot.player.on('error',(err: string)=> error(err, __filename))

bot.on("error", (err) => {
  error(err, __filename, true);
});

await bot.commandHandler.load()
await bot.contextMenuHandler.load()
await bot.modalHandler.load()
// await bot.deployApplicationCommand()

await bot.login(process.env.BOT_TOKEN);
