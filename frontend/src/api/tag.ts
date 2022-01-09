import {
  CreateTagPayload,
  CreateTagResponse,
  DeleteTagPayload,
  DeleteTagResponse,
  UpdateTagPayload,
  UpdateTagResponse
} from 'generated/models'
import { RequestAPI } from './request'

// All endpoints under the '/tags/' prefix
export class TagAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
  }

  async createTag(payload: CreateTagPayload): Promise<CreateTagResponse> {
    return this.req.post('/tags/', payload)
  }

  async deleteTag(payload: DeleteTagPayload): Promise<DeleteTagResponse> {
    return this.req.delete(`/tags/${payload.id}`)
  }

  async editTag(payload: UpdateTagPayload): Promise<UpdateTagResponse> {
    return this.req.put('/tags/', payload)
  }
}
