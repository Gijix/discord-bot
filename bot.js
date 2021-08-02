require("dotenv").config();
const Client = require("./customClient");
const bot = new Client();

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
  const parsedMsg = message.content.trim().split(" ");
  if (
    message.author.bot ||
    !message.member.voice.channelID ||
    !parsedMsg[0].startsWith(prefix)
  )
    return;
  const [play, stop, pause, resume, toggle] = [
    "play",
    "stop",
    "pause",
    "resume",
    "toggle",
  ];
  try {
    switch (parsedMsg[0].slice(1, parsedMsg[0].length)) {
      case play:
        let song = await bot.player.play(message, parsedMsg[1]);
        break;
      case pause:
         song = bot.player.pause(message);
        break;
      case resume:
         song = bot.player.resume(message);
        break;
      case stop:
         song = bot.player.stop(message);
        break;
      case toggle:
         song = bot.player.toggleLoop(message);
        if (toggle === null) return;
        break;
        default :
    }

    // if (parsedMsg[0] === prefix + play) {
    //   let song = await bot.player.play(message, parsedMsg[1]);
    // }
    // if (parsedMsg[0] === prefix + pause) {
    //   let song = bot.player.pause(message);
    // }
    // if (parsedMsg[0] === prefix + resume) {
    //   let song = bot.player.resume(message);
    // }
    // if (parsedMsg[0] === prefix + stop) {
    //   let song = bot.player.stop(message);
    // }
    // if (parsedMsg[0] === prefix + toggle) {
    //   let toggle = bot.player.toggleLoop(message);
    //   if (toggle === null) return;
    // }
  } catch (error) {
    console.error(error);
  }
});

bot.on("message", async (message) => {
  if (message.author.bot) return;
  const parsedMsg = message.content.split(" ");
  commandsMsg.forEach((command) => {
    if (parsedMsg[0] === prefix + command.name) {
      command.fn(message, bot);
    }
  });
});

bot.on("voiceStateUpdate", async (oldstate, newstate) => {
  commandVoice.forEach((command) => {
    command.fn(oldstate, newstate);
  });
});

bot.on("error", (error) => {
  console.info("The websocket connection encountered an error:", error);
});

bot.login(process.env.BOT_TOKEN);
