export interface LocalStorage {
  set(key: string, value: any): void
  get<T = any>(key: string): T | null
  remove(key: string): void
}

export class Storage implements LocalStorage {
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  get<T = any>(key: string): T | null {
    const item = localStorage.getItem(key)
    return item && JSON.parse(item)
  }

  remove(key: string): void {
    localStorage.removeItem(key)
  }
}
