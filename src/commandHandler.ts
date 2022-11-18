import {
  Message,
  ChatInputCommandInteraction,
  PermissionsString,
  SlashCommandBuilder,
  REST,
  Routes,
  Collection
} from "discord.js";
import Client from "./customClient.js";
import { Handler } from "./baseHandler.js";
import { BaseComponent } from "./baseComponent.js";

type NonEmptyString<T extends string> = T extends '' ? never : T;

type MessageExtend = Message & {
  prefix: string;
  command: string;
  arguments: string[];
};

type BaseHandler<S> = (
  param: S extends true ? MessageExtend : ChatInputCommandInteraction,
  bot: Client
) => void | Promise<void>;

interface BaseCommandOption<T extends string, S extends string> {
  name: NonEmptyString<T>;
  description: NonEmptyString<S>;
  permissions?: PermissionsString[];
}

interface ChatInteractionOption<T extends string, S extends string> extends BaseCommandOption<T, S> {
  isSlash: true;
  builder?: SlashCommandBuilder
  handler(param: ChatInputCommandInteraction, bot: Client): Promise<void> | void;
}

interface MessageOption <T extends string, S extends string> extends BaseCommandOption<T, S> {
  isSlash?: false;
  handler(param: MessageExtend, bot: Client): void | Promise<void>;
}

export class CommandHandler extends Handler<Command> {
  isExtendedMessage(
    message: Message 
  ): message is MessageExtend {
    if (message.channel.isTextBased()) {
      return true
    }

    return false
  }

  get messages () {
    return this.cache.filter(command => !command.isSlash) as Collection<string, Command<false>>
  }

  get slashs () {
    return this.cache.filter(command => command.isSlash) as Collection<string, Command<true>>
  }

  async runMessage(message: Message, bot: Client) {
    const prefix = process.env.PREFIX!;
    const splitedMessage = message.content.split(" ");
    const messageCommand = splitedMessage.shift()!;
    const messagePrefix = messageCommand[0];
    const messageCommandParsed = messageCommand.slice(1);

    if (messagePrefix === prefix && this.isExtendedMessage(message)) {
      message.arguments = splitedMessage
      message.prefix = message.prefix
      message.command = messageCommandParsed

      await this.messages.get(messageCommandParsed)?.handler(message, bot)
    }
  }
}

export class Command<T extends boolean = boolean, R extends string = string, U extends string = string> extends BaseComponent<BaseHandler<boolean>> {
  description: string;
  isSlash: T;
  data?: SlashCommandBuilder;
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
      this.data = new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
    }
  }
}
