import './envCheck.js'
import { GatewayIntentBits, ActivityType, Events } from 'discord.js'
import Client from "./customClient.js";
import { error, log, success } from './logger.js';
import { filename } from 'dirname-filename-esm';
import { envCheck } from './envCheck.js';

const __filename = filename(import.meta)
const { Guilds, GuildMessages, GuildVoiceStates, MessageContent } = GatewayIntentBits
const bot = new Client({ intents: [Guilds, GuildMessages, GuildVoiceStates, MessageContent]});
const prefix = process.env.PREFIX!;

bot.on(Events.ClientReady, async (client) => {
  success("Orlando bot has started");
  client.user!.setStatus('idle');
  client.user!.setPresence({
    status: "online",
    activities: [{
      name: `<${prefix}commandName>`,
      type: ActivityType.Watching,
    }],
  });
});

bot.on(Events.InteractionCreate, (interaction) => {
  if (interaction.isChatInputCommand()) {
    bot.commandHandler.slashs.get(interaction.commandName)?.handler.call(bot, interaction)
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
  bot.commandHandler.runMessage(message, bot).catch((e) => error(e, __filename))
});

bot.on(Events.MessageDelete, async (messageDelete) => {
  // bot.logDeleteMsg(messageDelete);
});

bot.on(Events.MessageUpdate, (oldMessage, newMessage) => {
  if (newMessage.author!.bot) return;
  // bot.logUpdateMsg(oldMessage, newMessage);
});

bot.on(Events.GuildMemberAdd, (member) => {
  // bot.logUserState(member);
});

bot.on(Events.GuildMemberRemove,(member) => {
  // bot.logUserState(member)
})

bot.on(Events.VoiceStateUpdate, async (oldstate, newstate) => {
  // bot.logVoiceUpdate(oldstate, newstate);
});

bot.on(Events.Error, (err) => {
  error(err, __filename, true);
});

try {
  envCheck()
  await bot.setup()
  await bot.login();
} catch (err) {
   error(err as Error, __filename, true)
}
