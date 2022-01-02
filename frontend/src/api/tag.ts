import { Color } from 'types/common'
import { Tag } from 'types/tag'
import { RequestAPI, Response } from './request'

type Tags = Tag[]
interface TagsResponse extends Response, Tags {}
interface TagResponse extends Response, Tag {}

export interface CreatingTag {
  name: string
  color: Color
  boardId: number
}

export interface EditingTag extends CreatingTag {
  id: number
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

  async deleteTag(tagId: number): Promise<Response> {
    return this.req.delete(`/tags/${tagId}`)
  }

  async editTag(tag: EditingTag): Promise<TagResponse> {
    return this.req.put('/tags/', tag)
  }
}
