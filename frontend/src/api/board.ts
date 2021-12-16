import { Board } from 'types/board'
import { RequestAPI, Response } from './request'

type Boards = Board[]
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
