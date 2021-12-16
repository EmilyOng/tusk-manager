import { Common } from './common'
import { Task } from './task'

export interface Board extends Common {
  name: string
  color: string
  tasks: Task[]
}
