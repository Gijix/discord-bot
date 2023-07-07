import { joinVoiceChannel } from "@discordjs/voice";
import { CommandHandler, MessageCommand } from "./commandHandler.js";
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
    APIEmbed,
    TextBasedChannel,
    Events
  } from "discord.js";
import { ContextMenuHandler } from "./contextMenuHandler.js";
import { ModalHandler } from "./modalHandler.js";
import { log } from "./logger.js";
import { filename } from 'dirname-filename-esm'
import { error } from "./logger.js";
import { PlayerManager } from "./musicPlayer.js";
import { GuildDB } from "./database.js";
import { checkLogChannel } from "./decorator/checkLogChannel.js";

const __filename = filename(import.meta)


const eventMethodLogMap = {
  [Events.MessageCreate]: 'logMsg',
  [Events.MessageUpdate]: 'logUpdateMsg',
  [Events.MessageDelete]: 'logDeleteMsg', 
  [Events.VoiceStateUpdate]: 'logVoiceUpdate', 
  [Events.GuildMemberAdd]: 'logUserState', 
  [Events.GuildMemberRemove]: 'logUserState' 
} as const

class myClient<T extends boolean = boolean> extends Client<T> {
  constructor (arg: ClientOptions) {
    super(arg);
    (Object.keys(eventMethodLogMap) as ((keyof typeof eventMethodLogMap)[])).forEach((key) => {
      // @ts-ignore
      this.on(key, (arg1, arg2) => {
        if (arg2) {
      // @ts-ignore
          this[eventMethodLogMap[key]](arg1, arg2)
        } else {
      // @ts-ignore
          this[eventMethodLogMap[key]](arg1)
        }
      })
    })
  }

  GuildManager = GuildDB

  isSetup = false;

  override isReady (): this is myClient<true> {
    return super.isReady()
  }

  override async login(token?: string) {
    if (!this.isSetup) {
      throw new Error("bot isn't setup correctly")
    }

    return await super.login(token || process.env.BOT_TOKEN)
  }

  async setup () {
    await Promise.all([this.commandHandler.setup(), this.modalHandler.setup(), this.contextMenuHandler.setup()])
    await this.deployApplicationCommand()
    this.isSetup = true
  }

  commandHandler = new CommandHandler('dist', 'commands')
  contextMenuHandler = new ContextMenuHandler('dist', 'contextMenuCommands')
  modalHandler = new ModalHandler('dist', 'modals')
  playerManager: PlayerManager = new PlayerManager(this)

  async deployApplicationCommand () {
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
    const commandsSlash = this.commandHandler.slashs.map((command) => command.data?.toJSON())
    const contextMenuCommands = this.contextMenuHandler.cache.map((command) => command.builder.toJSON())
    try {
      const data = await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: [...commandsSlash, ...contextMenuCommands] },
      )
      log(`reloaded ${Array.isArray(data) ? data.length : 1 } application (/) commands.`);         
    } catch(err){
      error(err, __filename)
    }
  }


  checkPlayerCondition (message: MessageCommand) {
    const userChannelId = message.member.voice.channelId
    const botChannelId = message.guild.members.me!.voice.channelId
    const isOnvoice = userChannelId !== null;
    const botOnVoice = botChannelId !== null
    if (!isOnvoice) {
      message.reply('join a voice channel for playing song')

      return
    }

    if (botOnVoice &&  userChannelId !== botChannelId) {
      message.reply('bot already in a voice channel')

      return
    }

    return 
  }

  prefix: string = process.env.PREFIX || '$'

  join (member: GuildMember) {
    const channelId = member.voice.channelId

    if (!channelId) return

    return joinVoiceChannel({
      guildId: member.guild.id,
      channelId: channelId,
      adapterCreator: member.guild.voiceAdapterCreator
    })
  }

  /**
   * Check if the user who wrote the command has the perm for perfoming it
   */
  checkPerm(member: GuildMember, permList: PermissionsString[]): boolean {
    return (
      member.permissions.has(permList) || member.user.id === process.env.ADMIN_ID
    );
  }

  /**
   *  get date information
   */
  get eventTime() {
    const checkNum = (arg: number): string => {
      if (arg < 10) {
        return "0" + arg;
      } else {
        return arg.toString();
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
      fields,
      footer: { text: `${time.hours} H ${time.minutes}  -  ${time.day}/${time.month}/${time.year}`} 
    })
      .setColor(color)
    return embed;
  }

  async getGuildLogChannel (guildId: string) {
    const guild = await this.GuildManager.ensure(guildId)
    const id = guild.guildInfo.logCanalId
    if (id) {
      const guild = await this.guilds.fetch(guildId)
      return guild.channels.cache.get(id) as TextBasedChannel
    }
  }

  async log (data: APIEmbed, guildId: string) {
    const logChannel = await this.getGuildLogChannel(guildId)

    if (logChannel) {
      await logChannel.send({ embeds: [data]})
    }
  }

  /**
   * Display all "send message" event on selected channel
   */
  // @ts-ignore
  @checkLogChannel
  async logMsg(message: Message<true>, prefix: string) {  
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
    
    this.log(embed.data, message.guildId)
  }

  // @ts-ignore
  @checkLogChannel
  async logDeleteMsg(message: Message<true>) {
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

      this.log(embed.data, message.guildId)
    } catch (e) {
      error(e as string, __filename);
    }
  }

  // @ts-ignore
  @checkLogChannel
  async logUpdateMsg(oldMessage: Message<true>, newMessage: Message<true>) {
    const embed = this.createEmbed(
      "Blue",
      "Message Updated",
      newMessage.id,
      { name: "Author", value: `<@${newMessage.author.id}>`, inline: true },
      { name: "Old Message", value: oldMessage.content, inline: true },
      { name: `New Message`, value: newMessage.content, inline: true },
      { name: "Channel", value: (newMessage.channel as TextChannel).name, inline: false }
    );

    this.log(embed.data, newMessage.guildId)
  }

  // @ts-ignore
  @checkLogChannel
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
    
    this.log(embed.data, member.guild.id)
  }

  // @ts-ignore
  @checkLogChannel
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
    
    this.log(embed.data, oldstate.guild.id)
  }
}

export default myClient
