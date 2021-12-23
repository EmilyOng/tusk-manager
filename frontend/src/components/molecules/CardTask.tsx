import React from 'react'
import { format } from 'date-fns'
import { Task } from 'types/task'
import { faClock, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import Tag from 'components/atoms/Tag'
import Icon from 'components/atoms/Icon'
import Button from 'components/atoms/Button'
import DropdownMenu from './DropdownMenu'
import './CardTask.css'

type Props = {
  task: Task
  events: {
    onTaskEditing: (task: Task) => void
  }
}

const CardTask: React.FC<Props> = ({ task, events }) => {
  return (
    <div className="card" onClick={() => events.onTaskEditing(task)}>
      <div className="card-content">
        <div className="card-info-section">
          <div className="tags">
            {task.tags?.map((tag) => (
              <Tag key={tag.id} name={tag.name} color={tag.color} />
            ))}
          </div>
          <div className="action-menu">
            <DropdownMenu
              items={[<div key="delete">Delete</div>]}
              trigger={<Button icon={faEllipsisV} />}
            />
          </div>
        </div>
        <div className="content">{task.name}</div>
      </div>
      <footer className="card-footer">
        {task.dueAt && (
          <span className="card-footer-item due-at">
            <code>
              <Icon icon={faClock} /> {format(new Date(task.dueAt), 'E, LLL d')}
            </code>
          </span>
        )}
      </footer>
    </div>
  )
}

export default CardTask
