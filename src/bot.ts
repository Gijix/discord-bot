import { VoiceConnection, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { CommandHandler } from "./handlers/commandHandler.js";
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
    Events,
    Guild,
    ApplicationCommandOptionType,
    APIApplicationCommandSubcommandOption,
  } from "discord.js";
import { ContextMenuHandler } from "./handlers/contextMenuHandler.js";
import { ModalHandler } from "./handlers/modalHandler.js";
import { log } from "./util/logger.js";
import { filename } from 'dirname-filename-esm'
import { error } from "./util/logger.js";
import { PlayerManager } from "./musicPlayer.js";
import { GuildDb, UserDb } from "./database.js";
import { checkLogChannel } from "./decorator/checkLogChannel.js";
import { ComponentHandler } from './handlers/componentHandler.js';
import { EventHandler } from "./handlers/EventHandler.js";
import { listeners } from './events.native.js'
import { SocketManager } from "./lovense/socket.js";

type HandlerName = 'commandHandler' | 'modalHandler' | 'contextMenuHandler' | 'componentHandler' | 'eventHandler'

interface HandlerOptions { 
  paths?: Partial<Record<HandlerName, string>>
  token: string
  clientId: string
  databaseUrl?: string
  prefix?: string
}

const __filename = filename(import.meta)

const eventMethodLogMap = {
  [Events.MessageCreate]: 'logMsg',
  [Events.MessageUpdate]: 'logUpdateMsg',
  [Events.MessageDelete]: 'logDeleteMsg', 
  [Events.VoiceStateUpdate]: 'logVoiceUpdate', 
  [Events.GuildMemberAdd]: 'logUserState', 
  [Events.GuildMemberRemove]: 'logUserState'
} as const

class Bot<T extends boolean = boolean> extends Client<T> {
  botToken: string
  clientId: string
  socketManager = new SocketManager()
  constructor (arg: ClientOptions, handlerOptions: HandlerOptions) {
    super(arg);
    (Object.keys(eventMethodLogMap)).forEach((key) => {
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

    if (handlerOptions && handlerOptions.paths) {
      Object.keys(handlerOptions.paths).forEach(x => {
        this[x].path = handlerOptions.paths![x]
      })
    }

    this.clientId = handlerOptions.clientId
    this.botToken = handlerOptions.token
    this.prefix = handlerOptions.prefix || this.prefix
    this.rest = new REST({ version: '10' }).setToken(this.botToken)
  }

  GuildManager = GuildDb
  UserManager = UserDb

  isSetup = false;

  override isReady (): this is Bot<true> {
    return super.isReady()
  }

  override async login(token?: string) {
    if (!this.isSetup) {
      throw new Error("bot isn't setup correctly")
    }

    return await super.login(token || this.botToken)
  }

  async setup () {
    listeners.forEach(x => {
      this.eventHandler.cache.set(x.id || x.name, x)
    })
    let handlers = [this.commandHandler, this.modalHandler, this.contextMenuHandler, this.componentHandler].filter(x => x.path)
    await Promise.all(handlers.map(async(x) => x.load()))
    if (this.eventHandler.path) {
      await this.eventHandler.setup(this)
    }
    await Promise.all([await this.deployCommands()])
    this.isSetup = true
  }

  commandHandler = new CommandHandler()
  contextMenuHandler = new ContextMenuHandler()
  componentHandler = new ComponentHandler()
  modalHandler = new ModalHandler()
  eventHandler = new EventHandler()

  /** @deprecated */
  playerManager = new PlayerManager(this)

  private get applicationCommandsData () {
    const commandsSlash = this.commandHandler.slashs.filter(slash => slash.isActivated).map(x => {
      const options = x.subs.map(x => ({ name: x.name, description: x.description, options: x.options, type: ApplicationCommandOptionType.Subcommand})) as APIApplicationCommandSubcommandOption[]
      if (x.data) {
        if (x.data.options) x.data.options = [...x.data.options, ...options]
        else x.data.options = options
      }

      return x.data
    })

    const contextMenuCommands = this.contextMenuHandler.cache.map((command) => command.data)

    return  [...commandsSlash, ...contextMenuCommands]
  }

  rest: REST

  async deployCommands (guildId?: string) {
    let appCommandsData = this.applicationCommandsData
    if (appCommandsData.length <= 0) return
    try {
      const data = await this.rest.put(
        guildId ?
          Routes.applicationGuildCommands(this.clientId, guildId) :
          Routes.applicationCommands(this.clientId),
        { body: appCommandsData },
      )
      log(`successfuly deploy ${Array.isArray(data) ? data.length : 1 } application (/) commands.`);         
    } catch(err){
      error(err, __filename, true)
    }
  }

  prefix = '$'

  join(guild: Guild, channelId: string): VoiceConnection | undefined
  join(guild: Guild, channelId: string, force: true): VoiceConnection
  join(guild: Guild, channelId: string, force: false): VoiceConnection | undefined
  join(guild: Guild, channelId: string, force?: boolean): VoiceConnection | undefined {
    const join = () => joinVoiceChannel({
      guildId: guild.id,
      channelId: channelId,
      adapterCreator: guild.voiceAdapterCreator
    })
    const connection = getVoiceConnection(guild.id)

    if (connection?.joinConfig.channelId === channelId) {
      return connection
    }

    if (force) {
      connection?.destroy()

      return join()
    }

    return connection ? undefined : join()
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
  createEmbed(color: ColorResolvable, title: string, author: string, img?: string, ...fields: EmbedField[]): EmbedBuilder {
    const time = this.eventTime;
    const embed = new EmbedBuilder({
      title,
      author: {
        name: author,
      },
      fields: fields.filter((field) => field.value && field.name),
      footer: { text: `${time.hours} H ${time.minutes}  -  ${time.day}/${time.month}/${time.year}`}
    })
      .setColor(color)
    if (img) {
      embed.setImage(img)
    }
    return embed
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
      return await logChannel.send({ embeds: [data] })
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
      undefined,
      { name: "User", value: `<@${message.member!.user.id}>`, inline: true },
      { name: "Message", value: message.content, inline: true },
      { name: "Channel", value: (message.channel as TextChannel).name, inline: true }
    );
    
    await this.log(embed.data, message.guildId)
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
        undefined,
        { name: "Author", value: `<@${author.id}>`, inline: true },
        { name: "Message", value: message.content, inline: true },
        { name: "Channel", value: (message.channel as TextChannel).name, inline: true },
        { name: `deleted by`, value: `<@${executer.id}>`, inline: false }
      );

      await this.log(embed.data, message.guildId)
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
      undefined,
      { name: "Author", value: `<@${newMessage.author.id}>`, inline: true },
      { name: "Old Message", value: oldMessage.content, inline: true },
      { name: `New Message`, value: newMessage.content, inline: true },
      { name: "Channel", value: (newMessage.channel as TextChannel).name, inline: false }
    );

    await this.log(embed.data, newMessage.guildId)
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
      undefined,
      { name: "User", value: `<@${member.id}>`, inline: true },
      { name: "As", value: member.user.username, inline: true }
    );
    
    await this.log(embed.data, member.guild.id)
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
          undefined,
          { name: "User", value: `<@${newState.member!.id}>`, inline: false },
          { name: "Old channel", value: oldstate.channel!.name, inline: true },
          { name: "New Channel", value: newState.channel!.name, inline: true }
        );
      } else {
        embed = this.createEmbed(
          "Green",
          "User leave voiceChat",
          oldstate.member!.id,
          undefined,
          { name: "User", value: `<@${oldstate.member!.id}>`, inline: true },
          { name: "Channel", value: oldstate.channel!.name, inline: true }
        );
      }
    } else {
      embed = this.createEmbed(
        "Green",
        "User join a voiceChat",
        newState.member!.id,
        undefined,
        { name: "User", value: `<@${newState.member!.id}>`, inline: true },
        { name: "Channel", value: newState.channel!.name, inline: true }
      );
    }
    
    await this.log(embed.data, oldstate.guild.id)
  }
}

export default Bot
