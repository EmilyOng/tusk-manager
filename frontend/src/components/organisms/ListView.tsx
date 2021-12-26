import React, { createRef, useEffect, useState } from 'react'
import { compareAsc } from 'date-fns'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import CardTask from '../molecules/CardTask'
import FormTaskCreate, { Form as CreateTaskForm } from './FormTaskCreate'
import { Task } from 'types/task'
import { Tag } from 'types/tag'
import { Color } from 'types/common'
import Button from 'components/atoms/Button'
import LoadingBar from 'components/molecules/LoadingBar'
import ModalCard from 'components/molecules/ModalCard'
import FormTaskEdit, { Form as EditTaskForm } from './FormTaskEdit'
import FilterSort, { TaskSortBy } from 'components/molecules/FilterSort'
import FilterReverse from 'components/molecules/FilterReverse'
import { State } from 'types/state'
import './ListView.css'

type Props = {
  tasks: Task[]
  tags: Tag[]
  states: State[]
  state: State
  loading: boolean
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

const ListView: React.FC<Props> = ({
  tasks: tasks_,
  tags,
  states,
  state,
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

  return (
    <div
      className="list-view"
      ref={listViewWrapper}
      onDragOver={onDragOver}
      onDrop={(e: React.DragEvent<HTMLDivElement>) => onDrop(e, state)}
      onDragLeave={onDragLeave}
    >
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
        <div className="list-view-title">{state.name}</div>
        <div className="list-view-actions">
          <FilterSort events={{ onFilterSort }} />
          <FilterReverse events={{ onFilterReverse }} />
          <Button
            className="is-link is-light"
            icon={faPlus}
            events={{ onClick: openTaskCreateCard }}
          />
        </div>
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
