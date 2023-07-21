import { ClientEvents, Awaitable } from "discord.js";
import { BaseComponent } from "../baseComponent.js";
import { Handler } from "./AbstractHandler.js";
import Bot from "../bot.js";

type Key = keyof ClientEvents
type BaseListener<T extends Key> = (this: Bot<true>, ...arg: ClientEvents[T]) => Awaitable<void>

interface EventOptions<T extends Key> {
  name: T,
  once?: boolean
  listener: BaseListener<T>
}

export class EventListener<T extends Key = Key> extends BaseComponent<BaseListener<T>> {
  override name: Key
  once: boolean
  constructor (options: EventOptions<T>) {
    const { name, listener, once } = options
    super(name, listener)
    this.name = name
    this.once = once || false
  }
}


export class EventHandler extends Handler<EventListener> {
  async setup (client: Bot) {
    await this.load()
    this.cache.forEach(event => {
      client.on(event.name, event.handler.bind(client))
    })
  }
}
