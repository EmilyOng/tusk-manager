export interface User {
  id: number
  name: string
  email: string
}

export interface AuthUser extends User {
  password: string
}
