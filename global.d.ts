declare namespace NodeJS {
  export interface ProcessEnv {
    BOT_TOKEN: string,
    PREFIX: string,
    CLIENT_ID: string
    ADMIN_ID?: string
    OUTDIR: string
  }
}

declare interface ObjectConstructor {
  keys<T> (object: T): (keyof T)[]
  entries<S, T extends { [str: string] : S }>(o: T | ArrayLike<S>): [keyof typeof o, S][]
}

declare module 'socket.io-client' {
  const io: any
  export default io
}
