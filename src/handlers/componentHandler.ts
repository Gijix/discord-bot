import { ComponentType, MappedInteractionTypes, StringMappedInteractionTypes } from "discord.js";
import { BaseComponent } from "../baseComponent.js";
import Bot from "../bot.js";
import { Handler } from "./AbstractHandler.js";

type TypeKey = Exclude<keyof StringMappedInteractionTypes, 'ActionRow'>

type BaseHandler<S extends TypeKey> = (this: Bot<true>, interaction: StringMappedInteractionTypes<'cached' | 'raw'>[S]) => Promise<void>

interface ComponentOptions<S extends TypeKey> {
  type: S
  handler: BaseHandler<S>
  name: string
}

export class ComponentRow<S extends TypeKey = TypeKey> extends BaseComponent<BaseHandler<S>> {
  constructor (options: ComponentOptions<S>) {
    const { name, handler } = options
    super(name, handler)

  }
}

export class ComponentHandler extends Handler<ComponentRow> {
  
}
