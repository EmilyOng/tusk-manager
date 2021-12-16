import { Common } from './common'
import { Task } from './task'

export interface Category extends Common {
  name: string
  color: string
  tasks: Task[]
}
