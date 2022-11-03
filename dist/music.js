import { getVoiceConnection } from "@discordjs/voice";
const musicInfos = [
  {
    name: "play",
    description: "add a song to the server queue and init the queue"
  },
  { name: "getqueue" },
  {
    name: "stop",
    description: "stop the current song and clear the server queue"
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
    description: "add playlist to the server queue and init the queue"
  }
];
async function play(message, client, prefix) {
  const { player } = client;
  const isOnvoice = message.member.voice.channelId !== void 0;
  const botOnVoice = getVoiceConnection(message.guild.id) !== void 0;
  if (!isOnvoice || botOnVoice && isOnvoice !== botOnVoice)
    return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  let guildQueue = player.getQueue(message.guild.id);
  console.log({ command });
  switch (command) {
    case "play":
      let queue = player.createQueue(message.guild.id);
      await queue.join(message.member.voice.channel);
      let song = await queue[command](args.join(" ")).catch((_) => {
        if (!guildQueue)
          queue.stop();
      });
      break;
    case "skip":
      let skippedSong = guildQueue.skip();
      break;
    case "stop":
      guildQueue.stop();
      break;
    case "pause":
      guildQueue.setPaused();
      break;
    case "resume":
      guildQueue.setPaused(false);
      break;
    case "seek":
      guildQueue.seek(parseInt(args.join(" ")) * 1e3);
      break;
    case "getqueue":
      console.log({ guildQueue });
      break;
    default:
      console.log("default");
      break;
  }
}
export {
  musicInfos,
  play
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL211c2ljLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSBcImRpc2NvcmQuanNcIjtcclxuaW1wb3J0IENsaWVudCBmcm9tIFwiLi9jdXN0b21DbGllbnQuanNcIjtcclxuaW1wb3J0IHsgZ2V0Vm9pY2VDb25uZWN0aW9uIH0gZnJvbSAnQGRpc2NvcmRqcy92b2ljZSdcclxuXHJcbmludGVyZmFjZSBpbmZvIHtcclxuICBuYW1lOiBzdHJpbmdcclxuICBkZXNjcmlwdGlvbj86IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbXVzaWNJbmZvczogaW5mb1tdID0gW1xyXG4gIHtcclxuICAgIG5hbWU6IFwicGxheVwiLFxyXG4gICAgZGVzY3JpcHRpb246IFwiYWRkIGEgc29uZyB0byB0aGUgc2VydmVyIHF1ZXVlIGFuZCBpbml0IHRoZSBxdWV1ZVwiLFxyXG4gIH0sXHJcbiAgeyBuYW1lOlwiZ2V0cXVldWVcIiB9LFxyXG4gIHtcclxuICAgIG5hbWU6IFwic3RvcFwiLFxyXG4gICAgZGVzY3JpcHRpb246IFwic3RvcCB0aGUgY3VycmVudCBzb25nIGFuZCBjbGVhciB0aGUgc2VydmVyIHF1ZXVlXCIsXHJcbiAgfSxcclxuICB7IG5hbWU6IFwicGF1c2VcIiwgZGVzY3JpcHRpb246IFwicGF1c2UgdGhlIGN1cnJlbnQgc29uZ1wiIH0sXHJcbiAgeyBuYW1lOiBcInJlc3VtZVwiLCBkZXNjcmlwdGlvbjogXCJyZXN1bWUgdGhlIGN1cnJlbnQgc29uZ1wiIH0sXHJcbiAgeyBuYW1lOiBcInNraXBcIiwgZGVzY3JpcHRpb246IFwic2tpcCB0aGUgY3VycmVudCBzb25nXCIgfSxcclxuICB7IG5hbWU6IFwidG9nZ2xlXCIsIGRlc2NyaXB0aW9uOiBcInBsYXkgdGhlIGN1cnJlbnQgc29uZyBpbiBhIGxvb3BcIiB9LFxyXG4gIHsgbmFtZTogXCJyZW1vdmVcIiwgZGVzY3JpcHRpb246IFwicmVtb3ZlIGEgc29uZyBmcm9tIHRoZSBxdWV1ZSBieSBpbmRleFwiIH0sXHJcbiAgeyBuYW1lOiBcInNodWZmbGVcIiwgZGVzY3JpcHRpb246IFwic2h1ZmZsZSB0aGUgc2VydmVyIHF1ZXVlXCIgfSxcclxuICB7IG5hbWU6IFwic2Vla1wiLCBkZXNjcmlwdGlvbjogXCJzZWVrIGZvciBhIG1vbWVudCBpbiB0aGUgc29uZ1wiIH0sXHJcbiAge1xyXG4gICAgbmFtZTogXCJwbGF5bGlzdFwiLFxyXG4gICAgZGVzY3JpcHRpb246IFwiYWRkIHBsYXlsaXN0IHRvIHRoZSBzZXJ2ZXIgcXVldWUgYW5kIGluaXQgdGhlIHF1ZXVlXCIsXHJcbiAgfSxcclxuXTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwbGF5KG1lc3NhZ2U6IE1lc3NhZ2UsIGNsaWVudDogQ2xpZW50LCBwcmVmaXg6IHN0cmluZykge1xyXG4gIGNvbnN0IHsgcGxheWVyIH0gPSBjbGllbnRcclxuICBjb25zdCBpc09udm9pY2UgPSBtZXNzYWdlLm1lbWJlciEudm9pY2UuY2hhbm5lbElkICE9PSB1bmRlZmluZWQ7XHJcbiAgY29uc3QgYm90T25Wb2ljZSA9IGdldFZvaWNlQ29ubmVjdGlvbihtZXNzYWdlLmd1aWxkIS5pZCkgIT09IHVuZGVmaW5lZFxyXG5cclxuICBpZiAoIWlzT252b2ljZSB8fCAoYm90T25Wb2ljZSAmJiBpc09udm9pY2UgIT09IGJvdE9uVm9pY2UpKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IGFyZ3MgPSBtZXNzYWdlLmNvbnRlbnQuc2xpY2UocHJlZml4Lmxlbmd0aCkudHJpbSgpLnNwbGl0KC8gKy9nKTtcclxuICBjb25zdCBjb21tYW5kID0gYXJncy5zaGlmdCgpIS50b0xvd2VyQ2FzZSgpO1xyXG4gIGxldCBndWlsZFF1ZXVlID0gcGxheWVyLmdldFF1ZXVlKG1lc3NhZ2UuZ3VpbGQhLmlkKSE7XHJcblxyXG4gIGNvbnNvbGUubG9nKHtjb21tYW5kfSk7XHJcblxyXG4gIHN3aXRjaCAoY29tbWFuZCkge1xyXG4gICAgY2FzZSBcInBsYXlcIiB8fCBcInBsYXlsaXN0XCI6XHJcbiAgICAgIGxldCBxdWV1ZSA9IHBsYXllci5jcmVhdGVRdWV1ZShtZXNzYWdlLmd1aWxkIS5pZCk7XHJcbiAgICAgIGF3YWl0IHF1ZXVlLmpvaW4obWVzc2FnZS5tZW1iZXIhLnZvaWNlLmNoYW5uZWwhKTtcclxuICAgICAgbGV0IHNvbmcgPSBhd2FpdCBxdWV1ZVtjb21tYW5kXShhcmdzLmpvaW4oXCIgXCIpKS5jYXRjaCgoXykgPT4ge1xyXG4gICAgICAgIGlmICghZ3VpbGRRdWV1ZSkgcXVldWUuc3RvcCgpO1xyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFwic2tpcFwiIDpcclxuICAgICAgbGV0IHNraXBwZWRTb25nID0gZ3VpbGRRdWV1ZS5za2lwKClcclxuICAgIGJyZWFrXHJcbiAgICBjYXNlIFwic3RvcFwiOlxyXG4gICAgICBndWlsZFF1ZXVlLnN0b3AoKTtcclxuICAgIGJyZWFrXHJcbiAgICBjYXNlIFwicGF1c2VcIjpcclxuICAgICAgZ3VpbGRRdWV1ZS5zZXRQYXVzZWQoKTtcclxuICAgIGJyZWFrXHJcbiAgICBjYXNlIFwicmVzdW1lXCI6XHJcbiAgICAgIGd1aWxkUXVldWUuc2V0UGF1c2VkKGZhbHNlKTtcclxuICAgIGJyZWFrXHJcbiAgICBjYXNlIFwic2Vla1wiOlxyXG4gICAgICBndWlsZFF1ZXVlLnNlZWsocGFyc2VJbnQoYXJncy5qb2luKCcgJykpICogMTAwMCk7XHJcbiAgICBicmVha1xyXG4gICAgY2FzZSBcImdldHF1ZXVlXCI6XHJcbiAgICAgIGNvbnNvbGUubG9nKHtndWlsZFF1ZXVlfSlcclxuICAgIGJyZWFrXHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBjb25zb2xlLmxvZyhcImRlZmF1bHRcIik7XHJcbiAgICBicmVha1xyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiQUFFQSxTQUFTLDBCQUEwQjtBQU81QixNQUFNLGFBQXFCO0FBQUEsRUFDaEM7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLGFBQWE7QUFBQSxFQUNmO0FBQUEsRUFDQSxFQUFFLE1BQUssV0FBVztBQUFBLEVBQ2xCO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixhQUFhO0FBQUEsRUFDZjtBQUFBLEVBQ0EsRUFBRSxNQUFNLFNBQVMsYUFBYSx5QkFBeUI7QUFBQSxFQUN2RCxFQUFFLE1BQU0sVUFBVSxhQUFhLDBCQUEwQjtBQUFBLEVBQ3pELEVBQUUsTUFBTSxRQUFRLGFBQWEsd0JBQXdCO0FBQUEsRUFDckQsRUFBRSxNQUFNLFVBQVUsYUFBYSxrQ0FBa0M7QUFBQSxFQUNqRSxFQUFFLE1BQU0sVUFBVSxhQUFhLHdDQUF3QztBQUFBLEVBQ3ZFLEVBQUUsTUFBTSxXQUFXLGFBQWEsMkJBQTJCO0FBQUEsRUFDM0QsRUFBRSxNQUFNLFFBQVEsYUFBYSxnQ0FBZ0M7QUFBQSxFQUM3RDtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sYUFBYTtBQUFBLEVBQ2Y7QUFDRjtBQUVBLGVBQXNCLEtBQUssU0FBa0IsUUFBZ0IsUUFBZ0I7QUFDM0UsUUFBTSxFQUFFLE9BQU8sSUFBSTtBQUNuQixRQUFNLFlBQVksUUFBUSxPQUFRLE1BQU0sY0FBYztBQUN0RCxRQUFNLGFBQWEsbUJBQW1CLFFBQVEsTUFBTyxFQUFFLE1BQU07QUFFN0QsTUFBSSxDQUFDLGFBQWMsY0FBYyxjQUFjO0FBQWE7QUFFNUQsUUFBTSxPQUFPLFFBQVEsUUFBUSxNQUFNLE9BQU8sTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEtBQUs7QUFDcEUsUUFBTSxVQUFVLEtBQUssTUFBTSxFQUFHLFlBQVk7QUFDMUMsTUFBSSxhQUFhLE9BQU8sU0FBUyxRQUFRLE1BQU8sRUFBRTtBQUVsRCxVQUFRLElBQUksRUFBQyxRQUFPLENBQUM7QUFFckIsVUFBUSxTQUFTO0FBQUEsSUFDZixLQUFLO0FBQ0gsVUFBSSxRQUFRLE9BQU8sWUFBWSxRQUFRLE1BQU8sRUFBRTtBQUNoRCxZQUFNLE1BQU0sS0FBSyxRQUFRLE9BQVEsTUFBTSxPQUFRO0FBQy9DLFVBQUksT0FBTyxNQUFNLE1BQU0sU0FBUyxLQUFLLEtBQUssR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU07QUFDM0QsWUFBSSxDQUFDO0FBQVksZ0JBQU0sS0FBSztBQUFBLE1BQzlCLENBQUM7QUFDRDtBQUFBLElBQ0YsS0FBSztBQUNILFVBQUksY0FBYyxXQUFXLEtBQUs7QUFDcEM7QUFBQSxJQUNBLEtBQUs7QUFDSCxpQkFBVyxLQUFLO0FBQ2xCO0FBQUEsSUFDQSxLQUFLO0FBQ0gsaUJBQVcsVUFBVTtBQUN2QjtBQUFBLElBQ0EsS0FBSztBQUNILGlCQUFXLFVBQVUsS0FBSztBQUM1QjtBQUFBLElBQ0EsS0FBSztBQUNILGlCQUFXLEtBQUssU0FBUyxLQUFLLEtBQUssR0FBRyxDQUFDLElBQUksR0FBSTtBQUNqRDtBQUFBLElBQ0EsS0FBSztBQUNILGNBQVEsSUFBSSxFQUFDLFdBQVUsQ0FBQztBQUMxQjtBQUFBLElBQ0E7QUFDRSxjQUFRLElBQUksU0FBUztBQUN2QjtBQUFBLEVBQ0Y7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
