import { ComponentType, MappedInteractionTypes } from "discord.js";
import { BaseComponent } from "../baseComponent.js";
import Bot from "../bot.js";
import { Handler } from "./AbstractHandler.js";

type TypeKey = Exclude<ComponentType,1 | 4>

type BaseHandler<S extends TypeKey> = (this: Bot, interaction: MappedInteractionTypes[S]) => Promise<void>


interface ComponentOptions<S extends TypeKey> {
  type: TypeKey
  handler: BaseHandler<S>
  name: string
  description: string
}

export class ComponentRow<S extends TypeKey = TypeKey> extends BaseComponent<BaseHandler<S>> {
  constructor (options: ComponentOptions<S>) {
    const { name, description, handler } = options
    super(name, handler)
  }
}

export class ComponentHandler extends Handler<ComponentRow> {
  
}
