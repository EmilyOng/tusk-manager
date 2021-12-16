import React from 'react'
import { format } from 'date-fns'
import { Task } from 'types/task'
import './CardTask.css'
import Tag from 'components/atoms/Tag'

type Props = {
  task: Task
}

const CardTask: React.FC<Props> = ({ task }) => {
  return (
    <div className="card">
      <div className="card-content">
        <div className="tags">
          {task.tags.map(tag => <Tag key={tag.id} name={tag.name} color={tag.color} />)}
        </div>
        <div className="content">{task.name}</div>
      </div>
      <footer className="card-footer">
        <span className="card-footer-item created-at">{format(new Date(task.createdAt), "E, LLL d")}</span>
      </footer>
    </div>
  )
}

export default CardTask
