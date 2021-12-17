import { Base, Color } from './common'
import { Task } from './task'

export interface BoardPrimitive extends Base {
  name: string
  color: Color
}

export interface Board extends BoardPrimitive {
  tasks: Task[]
}
