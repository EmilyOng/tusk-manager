import {
  CreateMemberPayload,
  CreateMemberResponse,
  DeleteMemberPayload,
  DeleteMemberResponse,
  UpdateMemberPayload,
  UpdateMemberResponse
} from 'generated/models'
import { RequestAPI } from './request'

// All endpoints under the '/members' prefix
export class MemberAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI('/members')
  }

  async createMember(
    payload: CreateMemberPayload
  ): Promise<CreateMemberResponse> {
    return this.req.post('/', payload)
  }

  async editMember(
    payload: UpdateMemberPayload
  ): Promise<UpdateMemberResponse> {
    return this.req.put('/', payload)
  }

  async deleteMember(
    payload: DeleteMemberPayload
  ): Promise<DeleteMemberResponse> {
    return this.req.delete(`/${payload.id}`)
  }
}
