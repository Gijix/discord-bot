import { dirname as __dirname } from "path"
import { fileURLToPath } from "url"

export function dirname (meta: ImportMeta) {
  return __dirname(fileURLToPath(meta.url))
}

export async function asyncEach<S>(iterable: S[] | Map<string, S>, callback: (item: S, index: number) => Promise<void>) {
  if (iterable instanceof Map) {
    const list = Array.from(iterable)
    return Promise.all(list.map(async (item, index) => {
      return callback(item[1], index)
    }))
  }

  return Promise.all(iterable.map(callback))
}
