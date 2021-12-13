export interface User {
  id: string
  name: string
  email: string
}

export interface AuthUser extends User {
  password: string
}
