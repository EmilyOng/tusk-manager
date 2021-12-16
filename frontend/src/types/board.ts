import { Base, Color } from './common'
import { Task } from './task'

export interface Board extends Base {
  name: string
  color: Color
  tasks: Task[]
}
