import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { format } from 'date-fns'
import {
  faClock,
  faEllipsisV,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import TagItem from 'components/atoms/TagItem'
import Icon from 'components/atoms/Icon'
import Button from 'components/atoms/Button'
import DropdownMenu from '../DropdownMenu'
import './CardTask.scoped.css'
import { Task } from 'generated/models'

type Props = {
  task: Task
  events: {
    onTaskEditing: (task: Task) => void
    onDeleteTask: (taskId: number, cb: () => void) => void
  }
}

const CardTask: React.FC<Props> = ({ task, events }) => {
  function useDeleteTask() {
    const [deleting, setDeleting] = useState(false)
    const [confirmingDelete, setConfirmingDelete] = useState(false)

    function onConfirmingDeleteTask() {
      setConfirmingDelete(true)
    }

    function onDeleteTask(taskId: number) {
      setDeleting(true)
      events.onDeleteTask(taskId, () => setDeleting(false))
    }

    function abortDeleteTask() {
      setDeleting(false)
      setConfirmingDelete(false)
    }

    useEffect(() => {
      return () => {
        setDeleting(false)
        setConfirmingDelete(false)
      }
    }, [])

    return {
      deleting,
      confirmingDelete,
      onConfirmingDeleteTask,
      onDeleteTask,
      abortDeleteTask
    }
  }

  const {
    deleting,
    confirmingDelete,
    onConfirmingDeleteTask,
    onDeleteTask,
    abortDeleteTask
  } = useDeleteTask()

  return (
    <div className="card" onClick={() => events.onTaskEditing(task)}>
      <div className="card-content">
        <div className="card-info-section">
          <div className="tags">
            {task.tags?.map((tag) => (
              <TagItem key={tag.id} name={tag.name} color={tag.color} />
            ))}
          </div>
          <div className="action-menu">
            <DropdownMenu
              closeOnContentClick={false}
              items={[
                <Button
                  key="delete"
                  icon={faTrash}
                  label={confirmingDelete ? 'Really delete?' : 'Delete'}
                  className={clsx({
                    'is-danger': true,
                    'is-loading': deleting
                  })}
                  attr={{
                    onClick: () =>
                      confirmingDelete
                        ? onDeleteTask(task.id)
                        : onConfirmingDeleteTask(),
                    disabled: deleting
                  }}
                />
              ]}
              trigger={
                <Button
                  icon={faEllipsisV}
                  attr={{ onClick: abortDeleteTask }}
                />
              }
            />
          </div>
        </div>
        <div className="content">{task.name}</div>
      </div>
      <footer className="card-footer">
        {task.dueAt && (
          <span className="card-footer-item due-at">
            <code>
              <Icon icon={faClock} />{' '}
              {format(new Date(task.dueAt), 'E, LLL d yyyy')}
            </code>
          </span>
        )}
      </footer>
    </div>
  )
}

export default CardTask
