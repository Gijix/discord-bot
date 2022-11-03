import commandsMsg from "./commands/message/index.js";
import { musicInfos } from "./music.js";
function fn(messsage, bot, prefix) {
  const helpBasic = () => {
    let str = "";
    commandsMsg.forEach((com) => {
      str = str.concat("``" + prefix + com.name + "`` " + com.description + "\n");
    });
    return str;
  };
  const helpMusic = () => {
    let str = "";
    musicInfos.forEach((info) => {
      str = str.concat("``" + prefix + info.name + "`` " + info.description + "\n");
    });
    return str;
  };
  const embed = bot.createEmbed(
    "Purple",
    "Command List",
    bot.user.username,
    {
      name: "Basics",
      value: helpBasic(),
      inline: false
    },
    {
      name: "Music",
      value: helpMusic(),
      inline: false
    }
  );
  messsage.channel.send({ embeds: [embed] });
}
const name = "help";
const permList = ["SendMessages"];
const description = "";
var help_default = { fn, name, permList, description };
export {
  help_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2hlbHAudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IE1lc3NhZ2UsIFBlcm1pc3Npb25zU3RyaW5nIH0gZnJvbSBcImRpc2NvcmQuanNcIjtcclxuaW1wb3J0IENsaWVudCBmcm9tIFwiLi9jdXN0b21DbGllbnQuanNcIjtcclxuaW1wb3J0IGNvbW1hbmRzTXNnIGZyb20gXCIuL2NvbW1hbmRzL21lc3NhZ2UvaW5kZXguanNcIjtcclxuaW1wb3J0IHsgbXVzaWNJbmZvcyB9IGZyb20gJy4vbXVzaWMuanMnO1xyXG5cclxuZnVuY3Rpb24gZm4gKG1lc3NzYWdlOiBNZXNzYWdlLCBib3Q6IENsaWVudCwgcHJlZml4OiBzdHJpbmcpIHtcclxuICBjb25zdCBoZWxwQmFzaWMgPSAoKSA9PiB7XHJcbiAgICBsZXQgc3RyID0gXCJcIlxyXG4gICAgY29tbWFuZHNNc2cuZm9yRWFjaChjb20gPT4ge1xyXG4gICAgICBzdHIgPSBzdHIuY29uY2F0KFwiYGBcIitwcmVmaXgrY29tLm5hbWUrXCJgYCBcIitjb20uZGVzY3JpcHRpb24rXCJcXG5cIiApXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHN0clxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhlbHBNdXNpYyA9ICgpID0+IHtcclxuICAgIGxldCBzdHIgPSBcIlwiXHJcbiAgICBtdXNpY0luZm9zLmZvckVhY2goaW5mbyA9PiB7XHJcbiAgICAgIHN0ciA9IHN0ci5jb25jYXQoXCJgYFwiK3ByZWZpeCtpbmZvLm5hbWUrXCJgYCBcIitpbmZvLmRlc2NyaXB0aW9uK1wiXFxuXCIgKVxyXG4gICAgfSlcclxuICAgIHJldHVybiBzdHJcclxuICB9O1xyXG5cclxuICBjb25zdCBlbWJlZCA9IGJvdC5jcmVhdGVFbWJlZChcclxuICAgIFwiUHVycGxlXCIsXHJcbiAgICBcIkNvbW1hbmQgTGlzdFwiLFxyXG4gICAgYm90LnVzZXIhLnVzZXJuYW1lLFxyXG4gICAge1xyXG4gICAgICBuYW1lOiBcIkJhc2ljc1wiLFxyXG4gICAgICB2YWx1ZTogaGVscEJhc2ljKCksXHJcbiAgICAgIGlubGluZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6IFwiTXVzaWNcIixcclxuICAgICAgdmFsdWU6IGhlbHBNdXNpYygpLFxyXG4gICAgICBpbmxpbmU6IGZhbHNlXHJcbiAgICB9XHJcbiAgKTtcclxuXHJcbiAgbWVzc3NhZ2UuY2hhbm5lbC5zZW5kKHsgZW1iZWRzOiBbZW1iZWRdfSk7XHJcbn1cclxuXHJcbmNvbnN0IG5hbWUgPSBcImhlbHBcIjtcclxuXHJcbmNvbnN0IHBlcm1MaXN0OiBQZXJtaXNzaW9uc1N0cmluZ1tdID0gWydTZW5kTWVzc2FnZXMnXTtcclxuY29uc3QgZGVzY3JpcHRpb24gPSBcIlwiO1xyXG5leHBvcnQgZGVmYXVsdCB7IGZuLCBuYW1lLCBwZXJtTGlzdCwgZGVzY3JpcHRpb24gfTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIkFBRUEsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyxrQkFBa0I7QUFFM0IsU0FBUyxHQUFJLFVBQW1CLEtBQWEsUUFBZ0I7QUFDM0QsUUFBTSxZQUFZLE1BQU07QUFDdEIsUUFBSSxNQUFNO0FBQ1YsZ0JBQVksUUFBUSxTQUFPO0FBQ3pCLFlBQU0sSUFBSSxPQUFPLE9BQUssU0FBTyxJQUFJLE9BQUssUUFBTSxJQUFJLGNBQVksSUFBSztBQUFBLElBQ25FLENBQUM7QUFDRCxXQUFPO0FBQUEsRUFDVDtBQUVBLFFBQU0sWUFBWSxNQUFNO0FBQ3RCLFFBQUksTUFBTTtBQUNWLGVBQVcsUUFBUSxVQUFRO0FBQ3pCLFlBQU0sSUFBSSxPQUFPLE9BQUssU0FBTyxLQUFLLE9BQUssUUFBTSxLQUFLLGNBQVksSUFBSztBQUFBLElBQ3JFLENBQUM7QUFDRCxXQUFPO0FBQUEsRUFDVDtBQUVBLFFBQU0sUUFBUSxJQUFJO0FBQUEsSUFDaEI7QUFBQSxJQUNBO0FBQUEsSUFDQSxJQUFJLEtBQU07QUFBQSxJQUNWO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixPQUFPLFVBQVU7QUFBQSxNQUNqQixRQUFRO0FBQUEsSUFDVjtBQUFBLElBQ0E7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLE9BQU8sVUFBVTtBQUFBLE1BQ2pCLFFBQVE7QUFBQSxJQUNWO0FBQUEsRUFDRjtBQUVBLFdBQVMsUUFBUSxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBQyxDQUFDO0FBQzFDO0FBRUEsTUFBTSxPQUFPO0FBRWIsTUFBTSxXQUFnQyxDQUFDLGNBQWM7QUFDckQsTUFBTSxjQUFjO0FBQ3BCLElBQU8sZUFBUSxFQUFFLElBQUksTUFBTSxVQUFVLFlBQVk7IiwKICAibmFtZXMiOiBbXQp9Cg==
