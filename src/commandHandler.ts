import {
  Collection,
  Message,
  ChatInputCommandInteraction,
  PermissionsString,
  SlashCommandBuilder,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  REST,
  Routes
} from "discord.js";
import path from "path";
import { readdir } from "fs/promises";
import Client from "./customClient.js";
import { asyncEach } from "./utils.js";

type MessageExtend = Message & {
  prefix: string;
  command: string;
  arguments: string[];
};

type BaseHandler<S> = (
  param: S extends true ? MessageExtend : ChatInputCommandInteraction,
  bot: Client
) => void | Promise<void>;

interface BaseCommandOption {
  name: string;
  description: string;
  permissions?: PermissionsString[];
}

interface InteractionOption extends BaseCommandOption {
  isSlash: true;
  handler(param: ChatInputCommandInteraction, bot: Client): Promise<void> | void;
}

interface MessageOption extends BaseCommandOption {
  isSlash?: false;
  handler(param: Message, bot: Client): void | Promise<void>;
}

export class Command<T extends boolean = boolean> {
  static isExtendedMessage(
    message: Message & {
      prefix: string | undefined;
      arguments?: string[] | undefined;
      command?: string | undefined;
    }
  ): message is MessageExtend {
    if (
      message.prefix &&
      typeof message.prefix === "string" &&
      message.arguments &&
      Array.isArray(message.arguments) &&
      message.arguments.every((arg) => typeof arg === "string") &&
      message.command &&
      typeof message.command === "string"
    ) {
      return true;
    }

    return false;
  }
  static path = path.join(process.cwd(), "dist", "commands", "message");
  static messages = new Collection<string, Command<false>>();
  static slashs = new Collection<string, Command<true>>();
  static async runSlash(interaction: ChatInputCommandInteraction, bot: Client) {
    await asyncEach(this.slashs, async (command) => {
      if (interaction.commandName === command.name) {
        await command.handler(interaction, bot);
      }
    });
  }
  static async runMessage(message: Message, bot: Client) {
    await asyncEach(this.messages, async (command) => {
      const prefix = process.env.PREFIX!;
      const splitedMessage = message.content.split(" ");
      const messageCommand = splitedMessage.shift()!;
      const messagePrefix = messageCommand[0];
      const messageCommandParsed = messageCommand.slice(1);
      const extendedMessage = {
        ...message,
        prefix: messagePrefix as string | undefined,
        command: messageCommandParsed as string | undefined,
        arguments: splitedMessage as string[] | undefined,
      } as Message & {
        prefix: string | undefined;
        arguments?: string[] | undefined;
        command?: string | undefined;
      };

      if (
        messagePrefix === prefix &&
        messageCommandParsed === command.name &&
        this.isExtendedMessage(extendedMessage)
      ) {
        await command.handler(extendedMessage, bot)
      }
    });
  }

  static async deploySlash() {
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);
    const commands = this.slashs.map((command) => command.data!)

    try {
      console.log(`Started refreshing ${this.slashs.size} application (/) commands.`);
  
      const data = await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
        { body: commands },
      ) as any[];
  
      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      console.error(error);
    }
  }

  static async loadCommands() {
    const filenames = await readdir(this.path);
    for (const filename of filenames) {
      const filepath = path.join(Command.path, filename);
      const file = (await import("file://" + filepath)) as { default: any };
      const command = file.default;

      if (!(command instanceof Command)) {
        throw new Error("invalid command in commands directory");
      }

      if (command.isSlash) {
        this.slashs.set(command.name, command);
      } else {
        this.messages.set(command.name, command);
      }
    }

    await this.deploySlash();
  }

  name: string;
  descrption: string;
  isSlash: T;
  data?: RESTPostAPIChatInputApplicationCommandsJSONBody;
  handler: BaseHandler<boolean>;
  permissions: PermissionsString[] = [];

  constructor({
    name,
    description,
    handler,
    isSlash,
    permissions = [],
  }: MessageOption | InteractionOption) {
    if (Command.messages.has(name) || Command.slashs.has(name)) {
      throw new Error("Command name already exist");
    }

    const value = (isSlash || false) as T;
    this.name = name;
    this.descrption = description;
    this.handler = handler as BaseHandler<
      typeof isSlash extends boolean ? typeof isSlash : false
    >;
    this.isSlash = value;
    this.permissions = permissions;

    if (value === true) {
      this.data = new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .toJSON();
    }
  }
}
