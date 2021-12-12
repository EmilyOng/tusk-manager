export interface User {
  name: string
  email: string
}

export interface AuthUser extends User {
  password: string
}
