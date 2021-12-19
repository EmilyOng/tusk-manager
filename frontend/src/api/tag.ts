import { Color } from 'types/common'
import { TagPrimitive } from 'types/tag'
import { RequestAPI, Response } from './request'

type Tags = TagPrimitive[]
interface TagsResponse extends Response, Tags {}
interface TagResponse extends Response, TagPrimitive {}

export interface CreatingTag {
  name: string
  color: Color
  boardId: number
}

export class TagAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
  }

  async getTags(boardId: number): Promise<TagsResponse> {
    return this.req.get(`/boards/${boardId}/tags`)
  }

  async createTag(tag: CreatingTag): Promise<TagResponse> {
    return this.req.post('/tags/', tag)
  }
}
