import React, { useState } from 'react'
import clsx from 'clsx'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './ListView.css'
import CardTask from '../molecules/CardTask'
import FormTaskCreate, { Form } from './FormTaskCreate'
import { derivedState, State, Task } from 'types/task'
import Button from 'components/atoms/Button'
import ModalCard from 'components/molecules/ModalCard'

type Props = {
  tasks: Task[]
  state: State
  events: {
    onOpenCard: (task: Task) => void
    onCreateTask: (form: Form, cb: () => void) => void
  }
}

function useTaskCreateModal() {
  const [visible, setVisible] = useState(false)
  const [task, setTask] = useState<Task>()
  function openCard(task: Task) {
    setTask(task)
    setVisible(true)
  }
  function closeCard() {
    setTask(undefined)
    setVisible(false)
  }
  return {
    task,
    visible,
    openCard,
    closeCard
  }
}

const ListView: React.FC<Props> = ({ tasks, state, events }) => {
  const {
    task: openedTaskCreate,
    visible: isTaskCreating,
    openCard: openTaskCreateCard,
    closeCard: closeTaskCreateCard
  } = useTaskCreateModal()

  function createTask(form: Form, cb: () => void) {
    events.onCreateTask(form, () => {
      cb()
      closeTaskCreateCard()
    })
  }

  return (
    <div className={clsx({ 'list-view': true, [state]: true })}>
      {openedTaskCreate && (
        <ModalCard
          visible={isTaskCreating}
          title="Create a new task"
          events={{ onClose: closeTaskCreateCard }}
        >
          <FormTaskCreate
            state={state}
            events={{ onSubmit: createTask, onCancel: closeTaskCreateCard }}
          />
        </ModalCard>
      )}
      <div className="list-view-header">
        <div className="list-view-title">{derivedState(state)}</div>
        <Button
          className="is-link is-light"
          icon={faPlus}
          events={{ onClick: openTaskCreateCard }}
        />
      </div>
      <div className="tasks">
        {tasks.map((task) => (
          <CardTask key={task.id} task={task} events={{ ...events }} />
        ))}
      </div>
    </div>
  )
}

export default ListView
