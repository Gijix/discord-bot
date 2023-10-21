import { EventEmitter } from "events";

type BaseEventNames = Record<string | symbol, any[]>

type ListenerFunction<
  EventNames extends BaseEventNames,
  Name extends keyof EventNames
> = (...params: EventNames[Name]) => unknown

type Key<T> = Extract<keyof T, string>

export class TypedEmitter<EventNames extends BaseEventNames = BaseEventNames> extends EventEmitter {
  public override on<Name extends Key<EventNames>>(name: Name, run: ListenerFunction<EventNames, Name>) {
    return super.on(name, run as (...param: any) => void)
  }
  public override once<Name extends Key<EventNames>>(name: Name, run: ListenerFunction<EventNames, Name>) {
    return super.once(name, run as (...param: any) => void)
  }
  public override off<Name extends Key<EventNames>>(name: Name, run: ListenerFunction<EventNames, Name>,) {
      return super.off(name, run as (...param: any) => void)
  }

  public override emit<Name extends Key<EventNames>>(name: Name, ...params: EventNames[Name]): boolean {
    return super.emit(name, params)
  }
}
