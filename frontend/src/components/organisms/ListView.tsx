import React from 'react'
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
  return (
    <div className="list-view">
      <div className="list-view-title">{state}</div>
      <div className="tasks">
        {tasks.map((task) => (
          <CardTask key={task.id} task={task} events={{ ...events }} />
        ))}
      </div>
    </div>
  )
}

export default ListView
