import './envCheck.js'
import { GatewayIntentBits, ActivityType, Events } from 'discord.js'
import Bot from "./bot.js";
import { error, success } from './logger.js';
import { filename } from 'dirname-filename-esm';
import { envCheck } from './envCheck.js';

const __filename = filename(import.meta)
const { Guilds, GuildMessages, GuildVoiceStates, MessageContent } = GatewayIntentBits
const bot = new Bot({ intents: [Guilds, GuildMessages, GuildVoiceStates, MessageContent]});

bot.on(Events.ClientReady, async (client) => {
  success("Zebi bot has started");
  client.user.setStatus('idle');
  client.user.setPresence({
    status: "online",
    activities: [{
      name: `<${bot.prefix}commandName>`,
      type: ActivityType.Watching,
    }],
  });
});

bot.on(Events.InteractionCreate, async (interaction) => {
  if (!(interaction.inGuild())) return
  interaction
  if (interaction.isChatInputCommand()) {
    const command = bot.commandHandler.slashs.get(interaction.commandName)

    if (command) {
      if (command.isActivated) {
        await command.handler.call(bot, interaction).catch((err) => error(err, __filename, true))
      } else {
        await interaction.reply({ ephemeral: true, content: 'command not implemented yet'})
      }
    }
  }

  if (interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand()) {
    await bot.contextMenuHandler.runUserContextMenuInteraction(interaction, bot) 
  }

  if (interaction.isModalSubmit()) {
    await bot.modalHandler.onSubmit(interaction, bot)
  }

  if (interaction.isAnySelectMenu() || interaction.isButton()) {
    const component = bot.componentHandler.cache.get(interaction.customId)
    if (component) {
      await component.handler.call(bot, interaction)
    }
  }

})

bot.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !bot.isReady()) return;

  await bot.commandHandler.runMessage(message, bot).catch((e) => error(e, __filename))
});

try {
  envCheck()
  await bot.setup()
  await bot.login();
} catch (err) {
   error(err, __filename, true)
}

process.on('SIGINT', (signal) => {
  console.log( "\nshutting down from SIGINT" );
  console.log({signal})
  // some other closing procedures go here
  process.exit(0);
});