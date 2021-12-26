import { State } from 'types/state'
import { RequestAPI, Response } from './request'

type States = State[]
interface StatesResponse extends Response, States {}

export class StateAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
  }

  async getStates(boardId: number): Promise<StatesResponse> {
    return this.req.get(`/boards/${boardId}/states`)
  }
}
