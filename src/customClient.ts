import { joinVoiceChannel } from "@discordjs/voice";
import { Player } from "discord-music-player";
import { CommandHandler } from "./commandHandler.js";
import {
    Client,
    Message,
    PermissionsString,
    VoiceState,
    TextChannel,
    EmbedBuilder,
    ColorResolvable,
    EmbedField,
    GuildMember,
    ClientOptions,
    AuditLogEvent,
    REST,
    Routes,
  } from "discord.js";
import { ContextMenuHandler } from "./contextMenuHandler.js";

class myClient extends Client {
  constructor (arg: ClientOptions) {
    super(arg)
  }

  commandHandler = new CommandHandler('dist', 'commands')
  contextMenuHandler = new ContextMenuHandler('dist', 'contextMenuCommands')

  async deployApplicationCommand () {
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);
    const commandsSlash = this.commandHandler.slashs.map((command) => command.data?.toJSON())
    const contextMenuCommands = this.contextMenuHandler.cache.map((command) => command.builder.toJSON())
    try {
      const data = await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID!),
        { body: [...commandsSlash, ...contextMenuCommands]  },
      ) as any[]
      console.log(`Successfully reloaded ${data.length} application (/) commands.`);         
    } catch(error){console.error(error)}
  }

  player = new Player(this, {
    leaveOnEnd: false,
    leaveOnStop: false,
    leaveOnEmpty: true,
    timeout: 0,
    volume: 50,
    quality: "high",
  });

  CONFIG_CHANNEL_ID = null
  LOG_CHANNEL_ID = "871760169770582066"
  ADMIN_ID = "247100615489093632";

  prefix = process.env.PREFIX!

  join (message: Message) {
    return joinVoiceChannel({
      guildId:message.guildId!,
      channelId:message.member!.voice.channelId!,
      adapterCreator:message.guild!.voiceAdapterCreator
    })
  }

  logChannelMsg(message: Message): TextChannel {
    return message.guild!.channels.cache.find(
      (chan) => chan.id === "871760169770582066"
    ) as TextChannel;
  }

  logChannelVoice(arg: VoiceState | Message): TextChannel {
    return arg.guild!.channels.cache.find(
      (chan) => chan.id === "872055513871958046"
    ) as TextChannel;
  }

  logChannelUserState(member: GuildMember): TextChannel {
    return member.guild.channels.cache.get("872907085002702859") as TextChannel;
  }

  /**
   * Check if the user who wrote the command has the perm for perfoming it
   */
  checkPerm(member: GuildMember, permList: PermissionsString[]): boolean {
    return (
      member.permissions.has(permList) || member.user.id === this.ADMIN_ID
    );
  }

  /**
   *  get date information
   */
  get eventTime() {
    const checkNum = (arg: number): number | string => {
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
   */
  createEmbed(color: ColorResolvable, title: string, author: string, ...fields: EmbedField[]): EmbedBuilder {
    fields = fields.filter((field) => field.value && field.name)
    const time = this.eventTime;
    const embed = new EmbedBuilder({
      title,
      author: {
        name: author,
      },
      fields: [...fields],
      footer: { text: `${time.hours} H ${time.minutes}  -  ${time.day}/${time.month}/${time.year}`} 
    })
      .setColor(color)
    return embed;
  }

  /**
   * Display all "send message" event on selected channel
   */
  async logMsg(message: Message, prefix: string) {
    if ([
      this.logChannelMsg(message).id, 
      this.logChannelVoice(message).id, 
      this.logChannelUserState(message.member!).id
    ].includes(message.channel.id)) return;
  
    if (message.author.bot) return;

    const command = message.content.startsWith(prefix);
    const color = command ? "Yellow" : "Green";
    const title = command ? "Try Command" : "Send Message";
    const embed = this.createEmbed(
      color,
      title,
      message.id,
      { name: "User", value: `<@${message.member!.user.id}>`, inline: true },
      { name: "Message", value: message.content, inline: true },
      { name: "Channel", value: (message.channel as TextChannel).name, inline: true }
    );

    await this.logChannelMsg(message).send({ embeds: [embed.data]});
  }

  async logDeleteMsg(message: Message) {
    try {
      const fetchedLog = await message.guild!.fetchAuditLogs({
        type: AuditLogEvent.MessageDelete,
        limit: 1,
      });
      const executer = fetchedLog.entries.first()!.executor!;
      const author = message.member!.user;
      const embed = this.createEmbed(
        "Orange",
        "Message Deleted",
        message.id,
        { name: "Author", value: `<@${author.id}>`, inline: true },
        { name: "Message", value: message.content, inline: true },
        { name: "Channel", value: (message.channel as TextChannel).name, inline: true },
        { name: `deleted by`, value: `<@${executer.id}>`, inline: false }
      );
      this.logChannelMsg(message).send({ embeds: [embed.data]});
    } catch (e) {
      console.error(e);
    }
  }

  async logUpdateMsg(oldMessage: Message, newMessage: Message) {
    const embed = this.createEmbed(
      "Blue",
      "Message Updated",
      newMessage.id,
      { name: "Author", value: `<@${newMessage.author.id}>`, inline: true },
      { name: "Old Message", value: oldMessage.content, inline: true },
      { name: `New Message`, value: newMessage.content, inline: true },
      { name: "Channel", value: (newMessage.channel as TextChannel).name, inline: false }
    );
    await this.logChannelMsg(newMessage).send({ embeds: [embed]});
  }

  async logUserState(member: GuildMember) {
    const message = await member.guild.members.fetch(member)
      ? "User join guild"
      : "User leave guild";
    const embed = this.createEmbed(
      "Green",
      message,
      member.id,
      { name: "User", value: `<@${member.id}>`, inline: true },
      { name: "As", value: member.user.username, inline: true }
    );
    await this.logChannelUserState(member).send({ embeds: [embed.data]});
  }

  async logVoiceUpdate(oldstate: VoiceState, newState: VoiceState) {
    let embed;
    if (oldstate.channelId) {
      if (newState.channelId) {
        embed = this.createEmbed(
          "Blue",
          "User Switch voiceChat",
          newState.member!.id,
          { name: "User", value: `<@${newState.member!.id}>`, inline: false },
          { name: "Old channel", value: oldstate.channel!.name, inline: true },
          { name: "New Channel", value: newState.channel!.name, inline: true }
        );
      } else {
        embed = this.createEmbed(
          "Green",
          "User leave voiceChat",
          oldstate.member!.id,
          { name: "User", value: `<@${oldstate.member!.id}>`, inline: true },
          { name: "Channel", value: oldstate.channel!.name, inline: true }
        );
      }
    } else {
      embed = this.createEmbed(
        "Green",
        "User join a voiceChat",
        newState.member!.id,
        { name: "User", value: `<@${newState.member!.id}>`, inline: true },
        { name: "Channel", value: newState.channel!.name, inline: true }
      );
    }

    await this.logChannelVoice(oldstate).send({ embeds: [embed.data]});
  }
  /**
   *
   * @param {Message} message
   */
  loadResponse(message: Message) {
    const channelConfig = message.guild!.channels.cache.find(
      (chan) => chan.id === this.CONFIG_CHANNEL_ID
    );
  }
}


export default myClient
