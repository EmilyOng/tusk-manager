import { BoardPrimitive } from 'types/board'
import { RequestAPI, Response } from './request'

type Boards = BoardPrimitive[]
interface BoardsResponse extends Response, Boards {}

export class BoardAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
  }

  async getBoards(): Promise<BoardsResponse> {
    return this.req.get('/boards/')
  }
}
