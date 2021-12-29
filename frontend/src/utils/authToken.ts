import { Storage } from './localStorage'

export function getAuthToken() {
  const storage = new Storage()
  return storage.get<string>('token') ?? ''
}

export function setAuthToken(token: string) {
  const storage = new Storage()
  storage.set('token', token)
}

export function removeAuthToken() {
  const storage = new Storage()
  storage.remove('token')
}
