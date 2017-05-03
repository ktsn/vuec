import * as hash from 'hash-sum'
const cache = new Map<string, string>()

export function genScopeId(fileName: string): string {
  if (!cache.has(fileName)) {
    cache.set(fileName, 'data-v-' + hash(fileName))
  }
  return cache.get(fileName)!
}
