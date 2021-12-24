import { TagPrimitive } from 'types/tag'
import { State, Task } from 'types/task'
import { RequestAPI, Response } from './request'

type Tasks = Task[]
interface TasksResposne extends Response, Tasks {}
interface TaskResponse extends Response, Task {}

export interface CreatingTask {
  name: string
  description: string
  dueAt?: string
  state: State
  tags: TagPrimitive[]
  boardId: number
}

export interface EditingTask extends CreatingTask {
  id: number
}

export class TaskAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
  }

  async getTasks(boardId: number): Promise<TasksResposne> {
    return this.req.get(`/boards/${boardId}/tasks`)
  }

  async createTask(task: CreatingTask): Promise<TaskResponse> {
    return this.req.post('/tasks/', task)
  }

  async editTask(task: EditingTask): Promise<TaskResponse> {
    return this.req.put('/tasks/', task)
  }

  async deleteTask(taskId: number): Promise<Response> {
    return this.req.delete(`/tasks/${taskId}`)
  }
}
