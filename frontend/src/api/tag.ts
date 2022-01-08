import {
  CreateTagPayload,
  CreateTagResponse,
  DeleteTagPayload,
  DeleteTagResponse,
  GetBoardTagsPayload,
  GetBoardTagsResponse,
  UpdateTagPayload,
  UpdateTagResponse
} from 'generated/models'
import { RequestAPI } from './request'

export class TagAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
  }

  async getTags(payload: GetBoardTagsPayload): Promise<GetBoardTagsResponse> {
    return this.req.get(`/boards/${payload.boardId}/tags`)
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
