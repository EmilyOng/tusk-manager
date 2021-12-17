import { Base } from './common'
import { Tag } from './tag'

export enum State {
  Unstarted = 'Unstarted',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Unknown = 'Unknown'
}

export interface TaskPrimitive extends Base {
  name: string
  description?: string
  dueAt?: Date
  state: State
}

export interface Task extends TaskPrimitive {
  tags: Tag[]
}
