import {
  AuthUserResponse,
  LoginPayload,
  LoginResponse,
  Response,
  SignUpPayload,
  SignUpResponse
} from 'generated/models'
import { RequestAPI } from './request'

// All endpoints under the '/auth' prefix
export class AuthAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI('/auth')
  }

  async signUp(payload: SignUpPayload): Promise<SignUpResponse> {
    return this.req.post('/signup', payload)
  }

  async login(payload: LoginPayload): Promise<LoginResponse> {
    return this.req.post('/login', payload)
  }

  async getAuthUser(): Promise<AuthUserResponse> {
    return this.req.get('/')
  }

  async logout(): Promise<Response> {
    return this.req.post('/logout')
  }
}
