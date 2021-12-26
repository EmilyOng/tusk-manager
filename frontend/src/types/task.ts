import { Base } from './common'
import { Tag } from './tag'

export interface TaskPrimitive extends Base {
  name: string
  description: string
  stateId: number
  dueAt?: string
}

export interface Task extends TaskPrimitive {
  tags: Tag[]
}
