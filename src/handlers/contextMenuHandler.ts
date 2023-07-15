import { 
  UserContextMenuCommandInteraction,
  MessageContextMenuCommandInteraction,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
  ContextMenuCommandBuilder,
  ContextMenuCommandType
 } from "discord.js";
import Bot from "../bot.js";
import { BaseComponent } from "../baseComponent.js";
import { Handler } from "./AbstractHandler.js";

type CurrentInteraction<T> = T extends 2 ? UserContextMenuCommandInteraction : MessageContextMenuCommandInteraction 
type ContextMenuHandlerType<T extends ContextMenuCommandType> = (this: Bot, interaction: CurrentInteraction<T>) => Promise<void>

interface ContextMenuOptions<T extends ContextMenuCommandType> extends RESTPostAPIContextMenuApplicationCommandsJSONBody {
  type: T
  handler: ContextMenuHandlerType<T>
}

export class ContextMenuCommand<T extends ContextMenuCommandType = ContextMenuCommandType> extends BaseComponent<ContextMenuHandlerType<ContextMenuCommandType>> {
  type: T
  data: RESTPostAPIContextMenuApplicationCommandsJSONBody
  constructor (options: ContextMenuOptions<T>) {
    super(options.name, options.handler)
    this.type = options.type
  
    this.data = (new ContextMenuCommandBuilder())
      .setName(options.name)
      .setType(this.type).toJSON()
  }
}

export class ContextMenuHandler extends Handler<ContextMenuCommand> {
  async runUserContextMenuInteraction (interaction: UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction, bot: Bot) {
    await this.cache.get(interaction.commandName)?.handler.call(bot, interaction)
  }
}
