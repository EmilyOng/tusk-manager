import React, { createRef, useEffect, useState } from 'react'
import clsx from 'clsx'
import { compareAsc } from 'date-fns'
import {
  faPlus,
  faTrash,
  faArrowLeft,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'
import CardTask from 'components/molecules/CardTask'
import FormTaskCreate, { Form as CreateTaskForm } from '../FormTaskCreate'
import { Task } from 'types/task'
import { Tag } from 'types/tag'
import { Color } from 'types/common'
import Button from 'components/atoms/Button'
import LoadingBar from 'components/molecules/LoadingBar'
import ModalCard from 'components/molecules/ModalCard'
import FormTaskEdit, { Form as EditTaskForm } from '../FormTaskEdit'
import FilterSort, { TaskSortBy } from 'components/molecules/FilterSort'
import FilterReverse from 'components/molecules/FilterReverse'
import ListViewHeader from 'components/molecules/ListViewHeader'
import { State } from 'types/state'
import './ListView.scoped.css'

type Props = {
  tasks: Task[]
  tags: Tag[]
  states: State[]
  state: State
  loading: boolean
  position: {
    current: number
    limit: number
  }
  events: {
    onEditTask: (form: EditTaskForm, cb: () => void) => void
    onCreateTask: (form: CreateTaskForm, cb: () => void) => void
    onDeleteTask: (taskId: number, cb: () => void) => void
    onDragTask: (task: Task) => void
    onCreateTag: ({
      name,
      color,
      cb
    }: {
      name: string
      color: Color
      cb: (tag: Tag) => void
    }) => any
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
    onDropTask: (e: React.DragEvent<HTMLDivElement>, state: State) => void
    onEditState: (newState: State) => void
    onDeleteState: (stateId: number, cb: () => void) => void
    onMoveStateLeft: (state: State) => void
    onMoveStateRight: (state: State) => void
  }
}

enum TaskSortDirection {
  Ascending = 'Ascending',
  Descending = 'Descending'
}

type TaskSort = {
  sortBy: TaskSortBy
  reversed: TaskSortDirection
}

function useTaskCreateModal() {
  const [visible, setVisible] = useState(false)
  function openCard() {
    setVisible(true)
  }
  function closeCard() {
    setVisible(false)
  }
  return {
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

function useStateDeleteModal() {
  const [state, setState] = useState<State>()
  const [visible, setVisible] = useState(false)
  function openCard(state: State) {
    setState(state)
    setVisible(true)
  }
  function closeCard() {
    setState(undefined)
    setVisible(false)
  }
  return {
    state,
    visible,
    openCard,
    closeCard
  }
}

const ListView: React.FC<Props> = ({
  tasks: tasks_,
  tags,
  states,
  state,
  position,
  loading,
  events
}) => {
  const listViewWrapper = createRef<HTMLDivElement>()
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentSort, setCurrentSort] = useState<TaskSort>({
    sortBy: TaskSortBy.Name,
    reversed: TaskSortDirection.Ascending
  })

  useEffect(() => {
    // Sorts in ascending order
    setTasks([...sortTasks(tasks_, currentSort.sortBy)])
    if (currentSort.reversed === TaskSortDirection.Descending) {
      setTasks([...reverseTasks(tasks_)])
    }
    return () => {
      setTasks([])
    }
  }, [tasks_])
  // Handles task creation
  const {
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

  const [showDropzone, setShowDropzone] = useState(false)

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    events.onDragOver(e)
    e.stopPropagation()
    setShowDropzone(true)
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>, state: State) {
    events.onDropTask(e, state)
    e.stopPropagation()
    setShowDropzone(false)
  }

  function onDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    const rect = listViewWrapper.current?.getBoundingClientRect()
    if (!rect) {
      return
    }
    if (
      e.clientY < rect.top ||
      e.clientY > rect.bottom ||
      e.clientX < rect.left ||
      e.clientX > rect.right
    ) {
      setShowDropzone(false)
    }
  }

  function sortTasks(tasks: Task[], sortBy: TaskSortBy) {
    return tasks.sort((a, b) => {
      switch (sortBy) {
        case TaskSortBy.DueDate:
          return !a.dueAt
            ? 1
            : !b.dueAt
            ? -1
            : compareAsc(new Date(a.dueAt), new Date(b.dueAt))
        case TaskSortBy.Name:
          const a_ = a.name.toLowerCase()
          const b_ = b.name.toLowerCase()
          return a_ < b_ ? -1 : a_ > b_ ? 1 : 0
      }
    })
  }

  function reverseTasks(tasks: Task[]) {
    return tasks.reverse()
  }

  function onFilterSort(sortBy: TaskSortBy) {
    setCurrentSort({ ...currentSort, sortBy })
    const sortedTasks = sortTasks(tasks, sortBy)
    setTasks(
      currentSort.reversed === TaskSortDirection.Ascending
        ? [...sortedTasks]
        : [...reverseTasks(sortedTasks)]
    )
  }

  function onFilterReverse() {
    setCurrentSort({
      ...currentSort,
      reversed:
        currentSort.reversed === TaskSortDirection.Ascending
          ? TaskSortDirection.Descending
          : TaskSortDirection.Ascending
    })
    setTasks([...reverseTasks(tasks)])
  }

  // Handles state edit/delete
  const {
    state: openedStateDelete,
    visible: isStateDeleting,
    openCard: openStateDeleteCard,
    closeCard: closeStateDeleteCard
  } = useStateDeleteModal()
  const [deletingState, setDeletingState] = useState(false)

  function onDeleteState(stateId: number) {
    events.onDeleteState(stateId, () => {
      closeStateDeleteCard()
      setDeletingState(false)
    })
  }

  return (
    <div
      className="list-view"
      ref={listViewWrapper}
      onDragOver={onDragOver}
      onDrop={(e: React.DragEvent<HTMLDivElement>) => onDrop(e, state)}
      onDragLeave={onDragLeave}
    >
      {openedStateDelete && (
        <ModalCard
          visible={isStateDeleting}
          title="Delete state"
          events={{ onClose: closeStateDeleteCard }}
        >
          <div>
            Are you sure you want to delete &quot;{openedStateDelete.name}
            &quot;?
          </div>
          <div>This action is irreversible.</div>
          <div className="form-control">
            <Button
              type="button"
              className="is-light"
              label="Cancel"
              events={{ onClick: () => closeStateDeleteCard() }}
            />
            <Button
              type="submit"
              className={clsx({
                'is-danger': true,
                'is-loading': deletingState
              })}
              attr={{ disabled: deletingState }}
              label="Delete"
              events={{ onClick: () => onDeleteState(openedStateDelete.id) }}
            />
          </div>
        </ModalCard>
      )}
      <ModalCard
        visible={isTaskCreating}
        title="Create a new task"
        events={{ onClose: closeTaskCreateCard }}
      >
        <FormTaskCreate
          state={state}
          tags={tags}
          states={states}
          events={{
            onSubmit: createTask,
            onCancel: closeTaskCreateCard,
            onCreateTag: events.onCreateTag
          }}
        />
      </ModalCard>
      {openedTaskEdit && (
        <ModalCard
          visible={isTaskEditing}
          title={openedTaskEdit.name}
          events={{ onClose: closeTaskEditCard }}
        >
          <FormTaskEdit
            task={openedTaskEdit}
            states={states}
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
        <ListViewHeader
          state={state}
          events={{ onEditState: events.onEditState }}
        />
        <div className="list-view-actions">
          {position.current > 0 && (
            <Button
              icon={faArrowLeft}
              events={{ onClick: () => events.onMoveStateLeft(state) }}
            />
          )}
          {position.current < position.limit && (
            <Button
              icon={faArrowRight}
              events={{ onClick: () => events.onMoveStateRight(state) }}
            />
          )}
          <Button
            className="is-link is-light"
            icon={faPlus}
            events={{ onClick: openTaskCreateCard }}
          />
          <Button
            className="is-danger is-light"
            icon={faTrash}
            events={{ onClick: () => openStateDeleteCard(state) }}
          />
        </div>
      </div>
      <div className="list-view-filter">
        <FilterSort events={{ onFilterSort }} />
        <FilterReverse events={{ onFilterReverse }} />
      </div>
      {loading ? (
        <LoadingBar />
      ) : (
        <div className="tasks">
          {tasks.map((task) => (
            <div
              key={task.id}
              draggable={true}
              onDragStart={() => events.onDragTask(task)}
            >
              <CardTask
                task={task}
                events={{
                  onTaskEditing: openTaskEditCard,
                  onDeleteTask: events.onDeleteTask
                }}
              />
            </div>
          ))}
        </div>
      )}
      {showDropzone && (
        <div className="dropzone-overlay">
          <div className="dropzone-info">Drop tasks here!</div>
        </div>
      )}
    </div>
  )
}

export default ListView
