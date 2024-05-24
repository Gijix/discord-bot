import {
  Message,
  ChatInputCommandInteraction,
  PermissionsString,
  GuildMember,
  MessagePayload,
  MessageCreateOptions,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  APIApplicationCommandOption
} from "discord.js";
import Bot from "../bot.js";
import { Handler } from "./AbstractHandler.js";
import { BaseComponent } from "../baseComponent.js";
import { error } from "../util/logger.js";
import { filename } from 'dirname-filename-esm';
import { setTimeout } from "timers/promises";
import { ArgsFunc, InputDefault } from "../util/arguments.js";
import parse from 'yargs-parser'

const __filename = filename(import.meta)

type NonEmptyString<T extends string> = T extends '' ? never : T;

type DeferableMessage<InGuild extends boolean = any> = Message<InGuild> & {
  deferDelete (delay?: number): Promise<Message<InGuild>> 
}

async function deferDelete<InGuild extends boolean = false>(this: DeferableMessage<InGuild>, delay = 0): Promise<Message<InGuild>> {
  await setTimeout(delay);
  return await this.delete();
}

export interface MessageCommand<Options extends InputDefault = never, InGuild extends boolean = any> extends DeferableMessage<InGuild> {
  command: string;
  arguments: Options extends InputDefault ? ArgsFunc<Options> : never;
  send (arg: string | MessagePayload | MessageCreateOptions): Promise<DeferableMessage<InGuild>>
  member: InGuild extends true ? GuildMember : GuildMember | null
  replyDefer (arg: string | MessagePayload | MessageCreateOptions): Promise<DeferableMessage<InGuild>>
};

type BaseHandler<S, Options extends InputDefault = never, V extends boolean = any > = (
  this: Bot<true>,
  param: S extends true ? MessageCommand<Options, V> : V extends true ? ChatInputCommandInteraction<'cached' | 'raw'> :  ChatInputCommandInteraction
) => Promise<any> ;

interface BaseCommandOption<T extends string, S extends string, R extends boolean, U extends boolean, V extends boolean = false, Options extends InputDefault = never> {
  isActivated?: boolean
  name: U extends true ? Lowercase<NonEmptyString<T>> : NonEmptyString<T>;
  description: NonEmptyString<S>;
  permissions?: PermissionsString[];
  handler: BaseHandler<R, Options, V>
  guildOnly?: V
}

interface ChatInteractionOption<T extends string, S extends string, U extends boolean = boolean> extends BaseCommandOption<T, S, false, true, U> {
  isSlash: true
  options?: APIApplicationCommandOption[]
}

interface MessageOption <T extends string, S extends string, Options extends InputDefault, V extends boolean = false> extends BaseCommandOption<T, S, true, false, V, Options> {
  isSlash?: false;
  alias?: string[]
  arguments?: Options
}

function extract (message: Message) {
  const splitedMessage = message.content.match(/(?:[^\s"']+|['"][^'"]*["'])+/g)!;
  const messageCommand = splitedMessage.shift()!;
  const messagePrefix = messageCommand[0];
  const messageCommandParsed = messageCommand.slice(1);
  return {
    commandAlias: messageCommandParsed,
    prefix: messagePrefix,
    rest: splitedMessage
  }
}

export class CommandHandler extends Handler<Command> {
  onLoad (arg: Command) {
    if (arg.isMessage()) {
      if (this.messages.some(command => command.alias.includes(arg.name))) {
        throw new Error(`command name ${arg.name} already used for command alias`)
      }

      if (this.messages.some(command =>  arg.alias.includes(command.name))) {
        throw new Error(`command alias ${JSON.stringify(arg.alias)} already used for command name`)
      }
    }
  }

  get messages () {
    return this.cache.filter((command): command is Command<false> => !command.isSlash)
  }

  get slashs () {
    return this.cache.filter((command): command is Command<true> => command.isSlash)
  }

  getFromAlias (alias: string) {
    return this.messages.find(command => command.alias.includes(alias))
  }

  async runMessage(message: Message, bot: Bot<true>) {
    const { commandAlias, rest, prefix } = extract(message)
    let guildPrefix: string = process.env.PREFIX

    if (message.inGuild()) {
      guildPrefix = (await bot.GuildManager.ensure(message.guildId)).guildInfo.prefix || process.env.PREFIX
    }

    if (guildPrefix !== prefix) {
      return
    }

    const command = this.messages.get(commandAlias) || this.getFromAlias(commandAlias)
    if (!command) {
      error(`command doesn't exist: ${commandAlias}`, __filename)
      return
    }
    
    if ((command?.permissions.length && !(command?.permissions.some(perm => message.member?.permissions.has(perm)))))return 

    if (!command.isActivated) {
      message.reply('command not implemented yet')
      return
    }

    const args = parse(rest)
    let finalArgs = {} as ArgsFunc<InputDefault>
    for (let i = 0; i < command.arguments.length; i++) {
      let arg = command.arguments[i]
      let value = args[arg.name]
      if (arg.required) {
        if (!args[arg.name]) {
          return message.reply(`missing argument ${arg.name}`)
        } else {
          let types = ['number, boolean', 'string']
          for (let i = 0; i < types.length; i++) {
            if ((arg.type === types[i]) && typeof value !== types[i]) {
              return message.reply(`invalid value for ${arg.name}. expected ${types[i]}`)
            } else {
              finalArgs[arg.name] = value
            }
          }

          if (arg.type === 'user') {}
        }
      }
    }



    let messageCommand: MessageCommand<InputDefault> = Object.assign(message, {
      command: commandAlias,
      arguments: finalArgs,
      deferDelete: deferDelete,
      async send(this: MessageCommand ,arg: string | MessageCreateOptions | MessagePayload) {
        const msg = (await this.channel.send(arg)) as DeferableMessage
        msg.deferDelete = deferDelete
  
        return msg
      },
      async replyDefer (this: MessageCommand, arg: string | MessageCreateOptions | MessagePayload) {
        const msg = await this.reply(arg) as DeferableMessage
        msg.deferDelete = deferDelete
  
        return msg
      }
    })

    await command.handler.call(bot, messageCommand) 
  }

  addCommand<R extends string = string, U extends string = string, const MessageOptions extends InputDefault = InputDefault, S extends boolean = boolean> (options: MessageOption<R, U, MessageOptions, S> | ChatInteractionOption<R, U, S> ) {
    //@ts-ignore
    this.cache.set(options.name , new Command(options))
  }
}

export class Command<T extends boolean = any, R extends string = string, U extends string = string, const MessageOptions extends InputDefault = InputDefault, S extends boolean = boolean> extends BaseComponent<BaseHandler<boolean, InputDefault, S>> {
  description: string
  isActivated: boolean
  isSlash: T;
  guildOnly: S = false as S
  data?: RESTPostAPIChatInputApplicationCommandsJSONBody
  permissions: PermissionsString[] = [];
  alias: string[] = []
  arguments: InputDefault = []

  isMessage (): this is Command<false> {
    return this.isSlash !== true
  }

  constructor(arg: MessageOption<R, U, MessageOptions, S> | ChatInteractionOption<R, U, S>) {
    let { name, description, handler, isSlash, permissions, isActivated } = arg
    super(name, handler as BaseHandler<boolean, InputDefault, S>)
    
    if (isActivated === false) {
      this.isActivated = isActivated
    } else {
      this.isActivated = true
    }

    this.description = description;
    this.isSlash = isSlash as T ;
    this.permissions = permissions || [];
    if ('guildOnly' in arg) {
      this.guildOnly = (arg.guildOnly) as S
    }
    if (isSlash) {
      this.data = { name, description }
      if ('options' in arg ) {
        this.data.options = arg.options
      }

      if (!this.guildOnly) {
        this.data.dm_permission = false
      }

    } else  {
      if ('alias' in arg) {
        this.alias = arg.alias || []
      }

      if ('arguments' in arg) {
        this.arguments = arg.arguments || []
      }
    }
  }
}
