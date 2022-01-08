import {
  CreateStatePayload,
  CreateStateResponse,
  DeleteStatePayload,
  DeleteStateResponse,
  GetBoardStatesPayload,
  GetBoardStatesResponse,
  UpdateStatePayload,
  UpdateStateResponse
} from 'generated/models'
import { RequestAPI } from './request'

export class StateAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
  }

  async getStates(
    payload: GetBoardStatesPayload
  ): Promise<GetBoardStatesResponse> {
    return this.req.get(`/boards/${payload.boardId}/states`)
  }

  async createState(payload: CreateStatePayload): Promise<CreateStateResponse> {
    return this.req.post('/states/', payload)
  }

  async editState(payload: UpdateStatePayload): Promise<UpdateStateResponse> {
    return this.req.put('/states/', payload)
  }

  async deleteState(payload: DeleteStatePayload): Promise<DeleteStateResponse> {
    return this.req.delete(`/states/${payload.id}`)
  }
}
