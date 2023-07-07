import { 
  UserContextMenuCommandInteraction,
  MessageContextMenuCommandInteraction,
  ContextMenuCommandBuilder,
  ContextMenuCommandType
 } from "discord.js";
import Client from "./customClient.js";
import { BaseComponent } from "./baseComponent.js";
import { Handler } from "./baseHandler.js";

type CurrentInteraction<T> = T extends 2 ? UserContextMenuCommandInteraction : MessageContextMenuCommandInteraction 
type ContextMenuHandlerType<T extends ContextMenuCommandType> = (this: Client, interaction: CurrentInteraction<T>) => Promise<void> | void

interface ContextMenuOptions<T extends ContextMenuCommandType> {
  name: string
  type: T
  builder?: ContextMenuCommandBuilder
  handler: ContextMenuHandlerType<T>
}

export class ContextMenuCommand<T extends ContextMenuCommandType = ContextMenuCommandType> extends BaseComponent<ContextMenuHandlerType<ContextMenuCommandType>> {
  type: T
  builder: ContextMenuCommandBuilder
  constructor (options: ContextMenuOptions<T>) {
    super(options.name, options.handler)
    this.type = options.type
    this.builder = options.builder ?? (new ContextMenuCommandBuilder())
      .setName(options.name)
      .setType(this.type)
  }
}

export class ContextMenuHandler extends Handler<ContextMenuCommand> {
  async runUserContextMenuInteraction (interaction: UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction, bot: Client) {
    await this.cache.get(interaction.commandName)?.handler.call(bot, interaction)
  }
}
