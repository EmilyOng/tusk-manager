export interface User {
  id: number
  name: string
  email: string
  token: string
}

export interface AuthUser extends User {
  password: string
}
