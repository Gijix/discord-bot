import { 
  CommandInteraction, 
  MessageComponentInteraction, 
  ModalSubmitInteraction, 
  TextInputBuilder, 
  ModalBuilder, 
  ActionRowBuilder,
  TextInputStyle,
} from "discord.js";
import { BaseComponent } from "./baseComponent.js";
import { Handler } from "./baseHandler.js";
import Client from './customClient.js'

type ComponentOptions = {[key: string]: {
  style: TextInputStyle
  label: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  value?: string;
  placeholder?: string;
}}

type ModalHandlerFunction<T extends ComponentOptions> = (this: Client, data:{[K in keyof T]: string}, interaction: ModalSubmitInteraction) => void | Promise<void>

interface ModalOptions<T extends ComponentOptions> {
  name: string
  components: T,
  id: string
  handler: ModalHandlerFunction<T>
}

export class Modal<T extends ComponentOptions = ComponentOptions> extends BaseComponent<ModalHandlerFunction<T>> {
  modal: ModalBuilder
  id: string
  constructor(options: ModalOptions<T>) {
    super(options.name, options.handler)
    const modal = new ModalBuilder({
      customId: options.id,
      title: options.name
    })

    Object.keys(options.components).forEach((key) => {
      const actionRow = new ActionRowBuilder<TextInputBuilder>()
      actionRow.addComponents(new TextInputBuilder(options.components[key]).setCustomId(key))
      modal.addComponents(actionRow)
    })

    this.id = options.id
    this.modal = modal
  }

  async trigger (interaction: CommandInteraction | MessageComponentInteraction ) {
    await interaction.showModal(this.modal)
  }
}

export class ModalHandler extends Handler<Modal> {
  onSubmit (interaction: ModalSubmitInteraction, bot: Client) {
    const fieldList: Record<string, string> = {}
    interaction.fields.fields.forEach((textInput) => {
      fieldList[textInput.customId] = textInput.value 
    })

    this.cache.get(interaction.customId)!.handler.call(bot, fieldList, interaction)
  }
}
