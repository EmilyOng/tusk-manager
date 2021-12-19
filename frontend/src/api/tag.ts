import { TagPrimitive } from 'types/tag'
import { RequestAPI, Response } from './request'

type Tags = TagPrimitive[]
interface TagsResponse extends Response, Tags {}

export class TagAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
  }

  async getTags(boardId: number): Promise<TagsResponse> {
    return this.req.get(`/boards/${boardId}/tags`)
  }
}
