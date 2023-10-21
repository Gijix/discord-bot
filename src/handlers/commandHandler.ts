import {
  Message,
  ChatInputCommandInteraction,
  PermissionsString,
  MessageMentions,
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


const __filename = filename(import.meta)

type NonEmptyString<T extends string> = T extends '' ? never : T;

type DeferableMessage = Message<true> & {
  deferDelete (delay?: number): Promise<Message<true>> 
}

async function deferDelete (this: DeferableMessage, delay = 0): Promise<Message<true>> {
  await setTimeout(delay);
  return await this.delete();
}

export interface MessageCommand extends DeferableMessage {
  command: string;
  arguments: string[];
  send (arg: string | MessagePayload | MessageCreateOptions): Promise<DeferableMessage>
  member: GuildMember
  replyDefer (arg: string | MessagePayload | MessageCreateOptions): Promise<DeferableMessage>
};

type BaseHandler<S> = (
  this: Bot<true>,
  param: S extends true ? MessageCommand : ChatInputCommandInteraction<'raw' | 'cached'>,
  // options: S extends true ? undefined : T
) => Promise<void> ;

interface BaseCommandOption<T extends string, S extends string, R extends boolean, U extends boolean> {
  isActivated?: boolean
  name: U extends true ? Lowercase<NonEmptyString<T>> : NonEmptyString<T>;
  description: NonEmptyString<S>;
  permissions?: PermissionsString[];
  handler: BaseHandler<R>
}

interface ChatInteractionOption<T extends string, S extends string, R extends APIApplicationCommandOption = APIApplicationCommandOption> extends BaseCommandOption<T, S, false, true> {
  isSlash: true;
  options?: R[]
}

interface MessageOption <T extends string, S extends string> extends BaseCommandOption<T, S, true, false> {
  isSlash?: false;
  alias?: string[]
}

function isMention (str: string) {
  return [
    MessageMentions.ChannelsPattern,
    MessageMentions.RolesPattern,
    MessageMentions.UsersPattern,
    MessageMentions.EveryonePattern
  ].some((regex) => regex.test(str))
}

export class CommandHandler extends Handler<Command> {
  isExtendedMessage(
    message: Message 
  ): message is MessageCommand {
    return (message.inGuild() && Boolean(message.member))
  }

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

  async runMessage(message: Message<true>, bot: Bot<true>) {
    const prefix = process.env.PREFIX;
    const splitedMessage = message.content.split(" ").filter((str) => str);
    const messageCommand = splitedMessage.shift()!;
    const messagePrefix = messageCommand[0];
    const messageCommandParsed = messageCommand.slice(1);
    const command = this.messages.get(messageCommandParsed!) || this.getFromAlias(messageCommandParsed)
  
    if (!command) {
      error(`command doesn't exist: ${messageCommandParsed}`, __filename)
      return
    }
    
    if (
      !(messagePrefix === prefix && this.isExtendedMessage(message)) ||
      (command?.permissions.length && !(command?.permissions.some(perm => message.member?.permissions.has(perm))))
    ) return 

    if (!command.isActivated) {
      message.reply('command not implemented yet')
      return
    }

    message.arguments = splitedMessage.filter(str => !isMention(str))
    message.command = messageCommandParsed
    message.deferDelete = deferDelete
    message.send = async function (arg: string | MessageCreateOptions | MessagePayload) {
      const msg = (await this.channel.send(arg)) as DeferableMessage
      msg.deferDelete = deferDelete

      return msg
    }

    message.replyDefer = async function (arg: string | MessageCreateOptions | MessagePayload) {
      const msg = await this.reply(arg) as DeferableMessage
      msg.deferDelete = deferDelete

      return msg
    }

    await command.handler.call(bot, message) 
  }
}

export class Command<T extends boolean = boolean, R extends string = string, U extends string = string> extends BaseComponent<BaseHandler<boolean>> {
  description: string;
  isActivated: boolean
  isSlash: T;
  data?: RESTPostAPIChatInputApplicationCommandsJSONBody
  permissions: PermissionsString[] = [];
  alias: string[] = []

  isMessage (): this is Command<false> {
    return this.isSlash !== true
  } 

  constructor(options: MessageOption<R, U> | ChatInteractionOption<R, U>) {
    let { name, description, handler, isSlash, permissions, isActivated } = options
    super(name, handler)
    

    const value = isSlash === undefined ? false : isSlash

    if (isActivated === false) {
      this.isActivated = isActivated
    } else {
      this.isActivated = true
    }

    this.description = description;
    this.isSlash = value as T ;
    this.permissions = permissions || [];
    if (isSlash) {
      this.data = { name, description }
      if ('options' in options ) {
        this.data.options = options.options
      }
    } else  {
      if ('alias' in options) {
        this.alias = options.alias || []
      }
    }
  }
}
