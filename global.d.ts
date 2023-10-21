declare namespace NodeJS {
  export interface ProcessEnv {
    BOT_TOKEN: string,
    PREFIX: string,
    CLIENT_ID: string
    ADMIN_ID: string
    OUTDIR: string
    JWT_TOKEN: string
    LOV_IV: string
    LOV_TOKEN: string
  }
}

declare interface ObjectConstructor {
  keys<T> (object: T): (keyof T)[]
  entries<S, T extends { [str: string] : S }>(o: T | ArrayLike<S>): [keyof typeof o, S][]
}
