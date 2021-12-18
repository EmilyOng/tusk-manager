import { State, Task, TaskPrimitive } from 'types/task'
import { RequestAPI, Response } from './request'

type Tasks = Task[]
interface TasksResposne extends Response, Tasks {}
interface TaskResponse extends Response, TaskPrimitive {}

export interface CreatingTask {
  name: string
  description: string
  dueAt?: Date
  state: State
  boardId: number
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
}
