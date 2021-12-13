export enum State {
  Unstarted = 'Unstarted',
	InProgress = 'InProgress',
	Completed = 'Completed',
	Unknown = 'Unknown'
}

export interface Task {
  id: string
  name: string
  desription?: string
  dueAt?: Date
  state: State
}
