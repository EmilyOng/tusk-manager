import { format } from 'date-fns'
import React from 'react'
import { StatePrimitive, Task } from 'generated/models'
import { DATE_FORMAT } from 'utils/date'
import TagItem from 'components/atoms/TagItem'
import './StaticViewTask.scoped.css'

type Props = {
  task: Task
  states: StatePrimitive[]
}

const StaticViewTask: React.FC<Props> = ({ task, states }) => {
  return (
    <div>
      <div className="content">
        <p className="has-text-weight-bold">Name</p>
        <p>{task.name}</p>
        <p className="has-text-weight-bold">Description</p>
        <p>{task.description}</p>
        <p className="has-text-weight-bold">Due Date</p>
        <p>{task.dueAt ? format(new Date(task.dueAt), DATE_FORMAT) : '-'}</p>
      </div>

      <p className="has-text-weight-bold">Tags</p>
      <div className="tags-container">
        {task.tags.map((tag) => (
          <TagItem key={tag.id} name={tag.name} color={tag.color} />
        ))}
      </div>

      <div className="content">
        <p className="has-text-weight-bold">State</p>
        <p>{states.find((state) => state.id === task.stateId)?.name}</p>
      </div>
    </div>
  )
}

export default StaticViewTask
