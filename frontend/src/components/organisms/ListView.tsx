import React from 'react'
import clsx from 'clsx'
import './ListView.css'
import CardTask from '../molecules/CardTask'
import { State, Task } from 'types/task'

type Props = {
  tasks: Task[]
  state: State
  events: {
    onOpenCard: (task: Task) => void
  }
}

const ListView: React.FC<Props> = ({ tasks, state, events }) => {
  const derivedState =
    state === State.Completed
      ? 'Completed'
      : state === State.InProgress
      ? 'In Progress'
      : 'To Do'
  return (
    <div className={clsx({ 'list-view': true, [state]: true })}>
      <div className="list-view-title">{derivedState}</div>
      <div className="tasks">
        {tasks.map((task) => (
          <CardTask key={task.id} task={task} events={{ ...events }} />
        ))}
      </div>
    </div>
  )
}

export default ListView
