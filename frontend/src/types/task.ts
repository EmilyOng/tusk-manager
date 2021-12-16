import { Common } from './common'

export enum State {
  Unstarted = 'Unstarted',
	InProgress = 'InProgress',
	Completed = 'Completed',
	Unknown = 'Unknown'
}

export interface Task extends Common {
  name: string
  description?: string
  dueAt?: Date
  state: State
}
