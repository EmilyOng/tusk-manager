import { Base } from './common'
import { Tag } from './tag'

export enum State {
  Unstarted = 'Unstarted',
  InProgress = 'InProgress',
  Completed = 'Completed'
}

export function derivedState(state: State) {
  return state === State.Completed
    ? 'Completed'
    : state === State.InProgress
    ? 'In Progress'
    : 'To Do'
}

export interface TaskPrimitive extends Base {
  name: string
  description: string
  dueAt?: Date
  state: State
}

export interface Task extends TaskPrimitive {
  tags: Tag[]
}
