import {
  CreateStatePayload,
  CreateStateResponse,
  DeleteStatePayload,
  DeleteStateResponse,
  UpdateStatePayload,
  UpdateStateResponse
} from 'generated/models'
import { RequestAPI } from './request'

// All endpoints under the '/states/' prefix
export class StateAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
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
