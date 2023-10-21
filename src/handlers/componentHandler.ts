import { 
  StringMappedInteractionTypes,
  MessageActionRowComponentBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  RoleSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  UserSelectMenuBuilder,
  MentionableSelectMenuBuilder,
} from "discord.js";
import { BaseComponent } from "../baseComponent.js";
import Bot from "../bot.js";
import { Handler } from "./AbstractHandler.js";

type TypeKey = Exclude<keyof StringMappedInteractionTypes, 'ActionRow'>

const mappedBuilder = {
    ['Button'] : new ButtonBuilder(),
    ['StringSelectMenu'] : new StringSelectMenuBuilder(),
    ['ChannelSelectMenu'] : new ChannelSelectMenuBuilder(),
    ['RoleSelectMenu'] : new RoleSelectMenuBuilder(),
    ['UserSelectMenu'] : new UserSelectMenuBuilder(),
    ['MentionableSelectMenu'] : new MentionableSelectMenuBuilder(),
} satisfies Record<TypeKey, MessageActionRowComponentBuilder>

type BaseHandler<S extends TypeKey> = (this: Bot<true>, interaction: StringMappedInteractionTypes<'cached' | 'raw'>[S]) => Promise<void>

interface ComponentOptions<S extends TypeKey> {
  handler: BaseHandler<S>
  name: string
  type: S
  make (builder: typeof mappedBuilder[S]): void
}

export class ComponentRow<S extends TypeKey = TypeKey> extends BaseComponent<BaseHandler<S>> {
  data: typeof mappedBuilder[S] 
  type: S
  constructor (options: ComponentOptions<S>) {
    const { name, handler } = options
    super(name, handler)
    const builder = mappedBuilder[options.type]
    options.make(builder)
    this.data = builder
    this.type = options.type
    
  }
}

export class ComponentHandler extends Handler<ComponentRow> {
  get<T extends TypeKey = TypeKey>(id: string): ComponentRow<T> {
    const component = this.cache.get(id)
    if (!component) {
      throw new Error('invalid component id')
    }

    //@ts-ignore
    return component as ComponentRow<T>
  }
}
