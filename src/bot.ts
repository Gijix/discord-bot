import './envCheck.js'
import { GatewayIntentBits, ActivityType, Events } from 'discord.js'
import Client from "./customClient.js";
import { error, success } from './logger.js';
import { filename } from 'dirname-filename-esm';
import { envCheck } from './envCheck.js';

const __filename = filename(import.meta)
const { Guilds, GuildMessages, GuildVoiceStates, MessageContent } = GatewayIntentBits
const bot = new Client({ intents: [Guilds, GuildMessages, GuildVoiceStates, MessageContent]});

bot.on(Events.ClientReady, async (client) => {
  success("Zebi bot has started");
  client.user!.setStatus('idle');
  client.user!.setPresence({
    status: "online",
    activities: [{
      name: `<${bot.prefix}commandName>`,
      type: ActivityType.Watching,
    }],
  });
});

bot.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = bot.commandHandler.slashs.get(interaction.commandName)
    if (command) {
      if (command.isActivated) {
        await command.handler.call(bot,interaction)
      } else {
        await interaction.reply({ ephemeral: true, content: 'command not implemented yet'})
      }
    }
  }

  if (interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand()) {
    bot.contextMenuHandler.runUserContextMenuInteraction(interaction, bot) 
  }

  if (interaction.isModalSubmit()) {
    bot.modalHandler.onSubmit(interaction, bot)
  }
})

bot.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !bot.isReady()) return;

  bot.commandHandler.runMessage(message, bot).catch((e) => error(e, __filename))
});

try {
  envCheck()
  await bot.setup()
  await bot.login();
} catch (err) {
   error(err, __filename, true)
}
