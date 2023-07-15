import { 
  CommandInteraction, 
  ModalSubmitInteraction, 
  TextInputBuilder, 
  ModalBuilder, 
  ActionRowBuilder,
  TextInputStyle,
  ModalActionRowComponentBuilder,
} from "discord.js";
import { BaseComponent } from "../baseComponent.js";
import { Handler } from "./AbstractHandler.js";
import Bot from '../bot.js'
import { error } from "../logger.js";
import { filename } from 'dirname-filename-esm';

const __filename = filename(import.meta)

type ComponentOptions = Record<string, {
  style: TextInputStyle
  label: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  value?: string;
  placeholder?: string;
}>

type ModalHandlerFunction<T extends ComponentOptions> = (this: Bot, data:{[K in keyof T]: string}, interaction: ModalSubmitInteraction) => Promise<void>

interface ModalOptions<T extends ComponentOptions> {
  name: string
  components: T,
  id: string
  handler: ModalHandlerFunction<T>
}

export class Modal<T extends ComponentOptions = ComponentOptions> extends BaseComponent<ModalHandlerFunction<T>> {
  builder: ModalBuilder
  id: string
  constructor(options: ModalOptions<T>) {
    super(options.name, options.handler)
    const modal = new ModalBuilder({
      customId: options.id,
      title: options.name
    })

    Object.keys(options.components).forEach((key) => {
      const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
      actionRow.addComponents(new TextInputBuilder(options.components[key]).setCustomId(key as string))
      modal.addComponents(actionRow)
    })

    this.id = options.id
    this.builder = modal
  }

  async waitSubmit (interaction: CommandInteraction, time = 15_000) {
    return await interaction.awaitModalSubmit({ filter: (modalSubmit) => modalSubmit.id === this.id, time })
  }
}

export class ModalHandler extends Handler<Modal> {
  async onSubmit (interaction: ModalSubmitInteraction, bot: Bot) {
    const fieldList: Record<string, string> = {}
    interaction.fields.fields.forEach((textInput) => {
      fieldList[textInput.customId] = textInput.value 
    })

    const modal = this.cache.get(interaction.customId)
    
    if(!modal) {
      return error(`modal with custom id ${interaction.customId} doesn'exist`, __filename)
    }

    await modal.handler.call(bot, fieldList, interaction)
  }
}
