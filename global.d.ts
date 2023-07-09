declare namespace NodeJS {
  export interface ProcessEnv {
    BOT_TOKEN: string,
    PREFIX: string,
    CLIENT_ID: string
    ADMIN_ID: string
  }
}

declare interface ObjectConstructor {
  keys<T> (object: T): (keyof T)[]
}
