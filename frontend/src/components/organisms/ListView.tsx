import React, { useState } from 'react'
import clsx from 'clsx'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './ListView.css'
import CardTask from '../molecules/CardTask'
import FormTaskCreate, { Form as CreateTaskForm } from './FormTaskCreate'
import { derivedState, State, Task } from 'types/task'
import { TagPrimitive } from 'types/tag'
import { Color } from 'types/common'
import Button from 'components/atoms/Button'
import ModalCard from 'components/molecules/ModalCard'
import FormTaskEdit, { Form as EditTaskForm } from './FormTaskEdit'

type Props = {
  tasks: Task[]
  tags: TagPrimitive[]
  state: State
  events: {
    onEditTask: (form: EditTaskForm, cb: () => void) => void
    onCreateTask: (form: CreateTaskForm, cb: () => void) => void
    onCreateTag: ({
      name,
      color,
      cb
    }: {
      name: string
      color: Color
      cb: (tag: TagPrimitive) => void
    }) => any
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

function useTaskEditModal() {
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

const ListView: React.FC<Props> = ({ tasks, tags, state, events }) => {
  // Handles task creation
  const {
    task: openedTaskCreate,
    visible: isTaskCreating,
    openCard: openTaskCreateCard,
    closeCard: closeTaskCreateCard
  } = useTaskCreateModal()

  function createTask(form: CreateTaskForm, cb: () => void) {
    events.onCreateTask(form, () => {
      cb()
      closeTaskCreateCard()
    })
  }

  // Handles task edit
  const {
    task: openedTaskEdit,
    visible: isTaskEditing,
    openCard: openTaskEditCard,
    closeCard: closeTaskEditCard
  } = useTaskEditModal()

  function editTask(form: EditTaskForm, cb: () => void) {
    events.onEditTask(form, () => {
      cb()
      closeTaskEditCard()
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
            tags={tags}
            events={{
              onSubmit: createTask,
              onCancel: closeTaskCreateCard,
              onCreateTag: events.onCreateTag
            }}
          />
        </ModalCard>
      )}
      {openedTaskEdit && (
        <ModalCard
          visible={isTaskEditing}
          title={openedTaskEdit.name}
          events={{ onClose: closeTaskEditCard }}
        >
          <FormTaskEdit
            task={openedTaskEdit}
            tags={tags}
            events={{
              onSubmit: editTask,
              onCancel: closeTaskEditCard,
              onCreateTag: events.onCreateTag
            }}
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
          <CardTask
            key={task.id}
            task={task}
            events={{ onTaskEditing: openTaskEditCard }}
          />
        ))}
      </div>
    </div>
  )
}

export default ListView
