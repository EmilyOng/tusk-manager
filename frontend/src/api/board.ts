import {
  CreateBoardPayload,
  CreateBoardResponse,
  DeleteBoardPayload,
  DeleteBoardResponse,
  GetBoardPayload,
  GetBoardResponse,
  GetUserBoardsResponse,
  UpdateBoardPayload,
  UpdateBoardResponse
} from 'generated/models'
import { RequestAPI } from './request'

export class BoardAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
  }

  async getBoards(): Promise<GetUserBoardsResponse> {
    return this.req.get('/boards/')
  }

  async getBoard(payload: GetBoardPayload): Promise<GetBoardResponse> {
    return this.req.get(`/boards/${payload.id}`)
  }

  async createBoard(payload: CreateBoardPayload): Promise<CreateBoardResponse> {
    return this.req.post('/boards/', payload)
  }

  async editBoard(payload: UpdateBoardPayload): Promise<UpdateBoardResponse> {
    return this.req.put('/boards/', payload)
  }

  async deleteBoard(payload: DeleteBoardPayload): Promise<DeleteBoardResponse> {
    return this.req.delete(`/boards/${payload.id}`)
  }
}
