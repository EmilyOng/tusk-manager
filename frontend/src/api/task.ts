import { Task } from 'types/task'
import { RequestAPI, Response } from './request'

type Tasks = Task[]
interface TasksResposne extends Response, Tasks {}

export class TaskAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
  }

  async getTasks(boardId: number): Promise<TasksResposne> {
    return this.req.get(`/boards/${boardId}/tasks`)
  }
}
