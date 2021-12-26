import { State } from 'types/state'
import { RequestAPI, Response } from './request'

type States = State[]
interface StateResponse extends Response, State {}
interface StatesResponse extends Response, States {}

export interface CreatingState {
  name: string
  boardId: number
}

export interface EditingState extends CreatingState {
  id: number
}

export class StateAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
  }

  async getStates(boardId: number): Promise<StatesResponse> {
    return this.req.get(`/boards/${boardId}/states`)
  }

  async createState(state: CreatingState): Promise<StateResponse> {
    return this.req.post('/states/', state)
  }

  async editState(state: EditingState): Promise<StateResponse> {
    return this.req.put('/states/', state)
  }

  async deleteState(stateId: number): Promise<Response> {
    return this.req.delete(`/states/${stateId}`)
  }
}
