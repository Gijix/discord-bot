const { joinVoiceChannel } = require("@discordjs/voice");
const { Player } = require("discord-music-player"),
  {
    Client,
    Message,
    Permissions,
    VoiceState,
    TextChannel,
    MessageEmbed,
    ColorResolvable,
    EmbedFieldData,
    GuildMember,
  } = require("discord.js");
class myClient extends Client {
  player = new Player(this, {
    leaveOnEnd: false,
    leaveOnStop: false,
    leaveOnEmpty: true,
    timeout: 0,
    volume: 50,
    quality: "high",
  });
  configChannelId = null;
  adminId = "247100615489093632";
  /**
   * 
   * @param {Message} message 
   * @returns 
   */
  join(message){
    return joinVoiceChannel({
      guildId:message.guildId,
      channelId:message.member.voice.channelId,
      adapterCreator:message.guild.voiceAdapterCreator
    })
  }
  /**
   * @param {Message} message
   * @return {TextChannel}
   *
   */
  logChannelMsg(message) {
    return message.guild.channels.cache.find(
      (chan) => chan.id === "871760169770582066"
    );
  }
  /**
   *
   * @param {VoiceState | Message } arg
   * @returns  {TextChannel}
   */
  logChannelVoice(arg) {
    return arg.guild.channels.cache.find(
      (chan) => chan.id === "872055513871958046"
    );
  }
  /**
   * @param {GuildMember} member
   * @return {TextChannel}
   */
  logChannelUserState(member) {
    return member.guild.channels.cache.get("872907085002702859");
  }
  /**
   * Check if the user who wrote the command has the perm for perfoming it
   * @param {Message} msg
   * @param {Permissions} permList
   * @return {boolean}
   */
  checkPerm(msg, permList) {
    return (
      msg.member.permissions.has(permList) || msg.member.user.id === this.adminId
    );
  }
  /**
   *  get date information
   * @param {Message} msg
   */
  get eventTime() {
    /**
     *
     * @param {number} arg
     * @returns  {number | string}
     */
    const checkNum = (arg) => {
      if (arg < 10) {
        return "0" + arg;
      } else {
        return arg;
      }
    };
    const createdAt = new Date();
    return {
      year: checkNum(createdAt.getFullYear()),
      month: checkNum(createdAt.getMonth() + 1),
      day: checkNum(createdAt.getDate()),
      hours: checkNum(createdAt.getHours()),
      minutes: checkNum(createdAt.getMinutes()),
      seconds: checkNum(createdAt.getSeconds()),
    };
  }
  /**
   *  create embed message
   * @param {ColorResolvable} color
   * @param {any} title
   * @param {any} author
   * @param {EmbedFieldData[]} fields
   */
  createEmbed(color, title, author, ...fields) {
    const time = this.eventTime;
    const embed = new MessageEmbed()
      .setColor(color)
      .setTitle(title)
      .setAuthor(author)
      .addFields(...fields)
      .setTimestamp()
      .setFooter(
        `${time.hours} H ${time.minutes}  -  ${time.day}/${time.month}/${time.year}`
      );
    return embed;
  }
  /**
   * Display all "send message" event on selected channel
   * @param {Message} message
   */
  logMsg(message, prefix) {
    if (message.channel.id === this.logChannelMsg(message).id) return;
    if (message.channel.id === this.logChannelVoice(message).id) return;
    if (message.channel.id === this.logChannelUserState(message).id) return;
    if (message.author.bot) return;
    const command = message.content.startsWith(prefix);
    const color = command ? "YELLOW" : "GREEN";
    const title = command ? "Try Command" : "Send Message";
    const embed = this.createEmbed(
      color,
      title,
      message.id,
      { name: "User", value: `<@${message.member.user.id}>`, inline: true },
      { name: "Message", value: message.content, inline: true },
      { name: "Channel", value: message.channel.name, inline: true }
    );
    this.logChannelMsg(message).send(embed);
  }
  /**
   *
   * @param {Message} message
   */
  async logDeleteMsg(message) {
    try {
      const fetchedLog = await message.guild.fetchAuditLogs({
        type: "MESSAGE_DELETE",
        limit: 1,
      });
      const executer = fetchedLog.entries.first().executor;
      const author = message.member.user;
      /**
       * @type {TextChannel}
       */
      const embed = this.createEmbed(
        "ORANGE",
        "Message Deleted",
        message.id,
        { name: "Author", value: `<@${author.id}>`, inline: true },
        { name: "Message", value: message.content, inline: true },
        { name: "Channel", value: message.channel.name, inline: true },
        { name: `deleted by`, value: `<@${executer.id}>` }
      );
      this.logChannelMsg(message).send(embed);
    } catch (e) {
      console.error(e);
    }
  }
  /**
   *
   * @param {Message} oldMessage
   * @param {Message} newMessage
   */
  logUpdateMsg(oldMessage, newMessage) {
    const embed = this.createEmbed(
      "BLUE",
      "Message Updated",
      newMessage.id,
      { name: "Author", value: `<@${newMessage.author.id}>`, inline: true },
      { name: "Old Message", value: oldMessage.content, inline: true },
      { name: `New Message`, value: newMessage.content, inline: true },
      { name: "Channel", value: newMessage.channel.name }
    );
    this.logChannelMsg(newMessage).send(embed);
  }
  /**
   *
   * @param {GuildMember} member
   */
  logUserState(member) {
    const message = member.guild.member(member)
      ? "User join guild"
      : "User leave guild";
    const embed = this.createEmbed(
      "GREEN",
      message,
      member.id,
      { name: "User", value: `<@${member.id}>`, inline: true },
      { name: "As", value: member.user.username, inline: true }
    );
    this.logChannelUserState().send(embed);
  }
  /**
   *
   * @param {VoiceState} oldstate
   * @param {VoiceState} newState
   * @return {MessageEmbed}
   */
  logVoiceUpdate(oldstate, newState) {
    let embed;
    if (oldstate.channelID) {
      if (newState.channelID) {
        embed = this.createEmbed(
          "BLUE",
          "User Switch voiceChat",
          newState.member.id,
          { name: "User", value: `<@${newState.member.id}>` },
          { name: "Old channel", value: oldstate.channel.name, inline: true },
          { name: "New Channel", value: newState.channel.name, inline: true }
        );
      } else {
        embed = this.createEmbed(
          "GREEN",
          "User leave voiceChat",
          oldstate.member.id,
          { name: "User", value: `<@${oldstate.member.id}>`, inline: true },
          { name: "Channel", value: oldstate.channel.name, inline: true }
        );
      }
    } else {
      embed = this.createEmbed(
        "GREEN",
        "User join a voiceChat",
        newState.member.id,
        { name: "User", value: `<@${newState.member.id}>`, inline: true },
        { name: "Channel", value: newState.channel.name, inline: true }
      );
    }
    this.logChannelVoice(oldstate).send(embed);
  }
  /**
   *
   * @param {Message} message
   */
  loadResponse(message) {
    const channelConfig = message.guild.channels.cache.find(
      (chan) => chan.id === this.configChannelId
    );
  }
}
module.exports = myClient;
