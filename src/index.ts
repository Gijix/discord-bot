import './envCheck.js';
import { GatewayIntentBits, Partials } from 'discord.js';
import Bot from "./bot.js";
import './util/VoiceChannel.js'
import { error, warn } from './util/logger.js';
import { filename } from 'dirname-filename-esm';
import { envCheck } from './envCheck.js';
import { connect } from './database.js';

const __filename = filename(import.meta)
const { Guilds, GuildMessages, GuildVoiceStates, MessageContent, DirectMessages } = GatewayIntentBits
const bot = new Bot({ intents: [Guilds, GuildMessages, GuildVoiceStates, MessageContent, DirectMessages], partials: [Partials.Channel]});

try {
  envCheck()
  await connect()
  await bot.setup()
  await bot.login();
  
} catch (err) {
  error(err, __filename, true)
}

bot.on('error', (err) => {
  error(err,__filename, true)
})

process.on('SIGINT', (signal) => {
  warn( "shutting down from SIGINT" );
  console.log({signal})
  process.exit(0);
});
