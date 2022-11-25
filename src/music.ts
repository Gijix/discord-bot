import { Message } from "discord.js";
import Client from "./customClient.js";
import { getVoiceConnection } from '@discordjs/voice'

interface info {
  name: string
  description?: string
}

export const musicInfos: info[] = [
  {
    name: "play",
    description: "add a song to the server queue and init the queue",
  },
  { name:"getqueue" },
  {
    name: "stop",
    description: "stop the current song and clear the server queue",
  },
  { name: "pause", description: "pause the current song" },
  { name: "resume", description: "resume the current song" },
  { name: "skip", description: "skip the current song" },
  { name: "toggle", description: "play the current song in a loop" },
  { name: "remove", description: "remove a song from the queue by index" },
  { name: "shuffle", description: "shuffle the server queue" },
  { name: "seek", description: "seek for a moment in the song" },
  {
    name: "playlist",
    description: "add playlist to the server queue and init the queue",
  },
];

export async function play(message: Message, client: Client) {
  const { player } = client
  const isOnvoice = message.member!.voice.channelId !== undefined;
  const botOnVoice = getVoiceConnection(message.guild!.id) !== undefined

  if (!isOnvoice || (botOnVoice && isOnvoice !== botOnVoice)) return;

  const args = message.content.slice(process.env.PREFIX!.length).trim().split(/ +/g);
  const command = args.shift()!.toLowerCase();
  let guildQueue = player.getQueue(message.guild!.id)!;

  switch (command) {
    case "play" || "playlist":
      let queue = player.createQueue(message.guild!.id);
      await queue.join(message.member!.voice.channel!);
      let song = await queue[command](args.join(" ")).catch((_) => {
        if (!guildQueue) queue.stop();
      });
      break;
    case "skip" :
      let skippedSong = guildQueue.skip()
    break
    case "stop":
      guildQueue.stop();
    break
    case "pause":
      guildQueue.setPaused();
    break
    case "resume":
      guildQueue.setPaused(false);
    break
    case "seek":
      guildQueue.seek(parseInt(args.join(' ')) * 1000);
    break
    case "getqueue":
      console.log({guildQueue})
    break
    default:
      console.log("default");
    break
  }
}
