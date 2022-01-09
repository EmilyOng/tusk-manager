import {
  CreateTaskPayload,
  CreateTaskResponse,
  DeleteTaskPayload,
  DeleteTaskResponse,
  UpdateTaskPayload,
  UpdateTaskResponse
} from 'generated/models'
import { RequestAPI } from './request'

// All endpoints under the '/tasks/' prefix
export class TaskAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
  }

  async createTask(payload: CreateTaskPayload): Promise<CreateTaskResponse> {
    return this.req.post('/tasks/', payload)
  }

  async editTask(payload: UpdateTaskPayload): Promise<UpdateTaskResponse> {
    return this.req.put('/tasks/', payload)
  }

  async deleteTask(payload: DeleteTaskPayload): Promise<DeleteTaskResponse> {
    return this.req.delete(`/tasks/${payload.id}`)
  }
}
