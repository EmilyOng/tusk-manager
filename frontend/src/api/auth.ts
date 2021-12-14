import { AuthUser, User } from 'types/user'
import { RequestAPI, Response } from './request'

interface SignUpResponse extends Response, User {}
interface LoginResponse extends Response, User {}
interface AuthUserResponse extends Response, User {}

export class AuthAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
  }

  async signUp(user: AuthUser): Promise<SignUpResponse> {
    return this.req
      .post('/auth/signup', {
        Name: user.name,
        Email: user.email,
        Password: user.password,
      })
  }

  async login(user: Omit<AuthUser, 'name'>): Promise<LoginResponse> {
    return this.req
      .post('/auth/login', {
        Email: user.email,
        Password: user.password,
      })
  }

  async getAuthUser(): Promise<AuthUserResponse> {
    return this.req.get('/auth/')
  }
}
