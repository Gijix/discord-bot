import {
  Message,
  ChatInputCommandInteraction,
  PermissionsString,
  SlashCommandBuilder,
  Collection,
  MessageMentions,
  GuildMember,
  MessagePayload,
  MessageCreateOptions,
  SharedSlashCommandOptions,
  SharedNameAndDescription,
  RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";
import Client from "./customClient.js";
import { Handler } from "./baseHandler.js";
import { BaseComponent } from "./baseComponent.js";
import { error } from "./logger.js";
import { filename } from 'dirname-filename-esm';
import { setTimeout } from "timers/promises";


const __filename = filename(import.meta)

type NonEmptyString<T extends string> = T extends '' ? never : T;

type DeferableMessage = Message<true> & {
  deferDelete (delay?: number): Promise<Message<true>> 
}

interface Builder extends Partial<SharedSlashCommandOptions>, SharedNameAndDescription {
  toJSON (): RESTPostAPIChatInputApplicationCommandsJSONBody
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
  this: Client<true>,
  param: S extends true ? MessageCommand : ChatInputCommandInteraction,
) => void | Promise<void>;

interface BaseCommandOption<T extends string, S extends string> {
  name: NonEmptyString<T>;
  description: NonEmptyString<S>;
  permissions?: PermissionsString[];
}

interface ChatInteractionOption<T extends string, S extends string> extends BaseCommandOption<T, S> {
  isSlash: true;
  builder?: Builder
  handler(this: Client<true>, param: ChatInputCommandInteraction): Promise<void> | void;
}

interface MessageOption <T extends string, S extends string> extends BaseCommandOption<T, S> {
  isSlash?: false;
  handler(this: Client<true>, param: MessageCommand, bot: Client): void | Promise<void>;
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

  get messages () {
    return this.cache.filter(command => !command.isSlash) as Collection<string, Command<false>>
  }

  get slashs () {
    return this.cache.filter(command => command.isSlash) as Collection<string, Command<true>>
  }

  async runMessage(message: Message, bot: Client<true>) {
    const prefix = process.env.PREFIX!;
    const splitedMessage = message.content.split(" ").filter((str) => str);
    const messageCommand = splitedMessage.shift()!;
    const messagePrefix = messageCommand[0];
    const messageCommandParsed = messageCommand.slice(1);
    const command = this.messages.get(messageCommandParsed!)
  
    if (!command) {
      error(`command doesn't exist: ${messageCommandParsed}`, __filename)
      return
    }
    
    if (
      !(messagePrefix === prefix && this.isExtendedMessage(message)) ||
      (command?.permissions.length && !(command?.permissions.some(perm => message.member?.permissions.has(perm))))
    ) return 

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
  isSlash: T;
  data?: Builder;
  permissions: PermissionsString[] = [];

  constructor(options: MessageOption<R, U> | ChatInteractionOption<R, U>) {
    let { name, description, handler, isSlash, permissions } = options
    super(name, handler as BaseHandler<
      typeof isSlash extends boolean ? typeof isSlash : false
    > )

    const value = (isSlash || false) as T;

    this.description = description;
    this.isSlash = value;
    this.permissions = permissions || [];

    if (options.isSlash && options.builder) {
      this.data = options.builder
    }

    if (value === true) {
      this.data = (this.data || new SlashCommandBuilder())
        .setName(name)
        .setDescription(description)
    }
  }
}
