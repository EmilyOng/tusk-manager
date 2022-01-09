import {
  Response,
  SignUpResponse,
  AuthUserResponse,
  LoginResponse,
  SignUpPayload,
  LoginPayload
} from 'generated/models'
import { RequestAPI } from './request'

// All endpoints under the '/auth/' prefix
export class AuthAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
  }

  async signUp(payload: SignUpPayload): Promise<SignUpResponse> {
    return this.req.post('/auth/signup', payload)
  }

  async login(payload: LoginPayload): Promise<LoginResponse> {
    return this.req.post('/auth/login', payload)
  }

  async getAuthUser(): Promise<AuthUserResponse> {
    return this.req.get('/auth/')
  }

  async logout(): Promise<Response> {
    return this.req.post('/auth/logout')
  }
}
