import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useBoardTasks, useBoardStates, useBoardTags } from 'composables/board'
import ListView from 'components/organisms/ListView'
import { Form as CreateTaskForm } from 'components/organisms/FormTaskCreate'
import { Form as EditTaskForm } from 'components/organisms/FormTaskEdit'
import LoadingBar from 'components/molecules/LoadingBar'
import { NotificationType, useNotification } from 'composables/notification'
import './TaskDashboard.scoped.css'
import ListViewPlaceholder from 'components/organisms/ListViewPlaceholder'
import { TagAPI } from 'api/tag'
import { TaskAPI } from 'api/task'
import { Task, StatePrimitive, TagPrimitive } from 'generated/models'
import { Color } from 'generated/types'
import { useSelector } from 'react-redux'
import { selectMe } from 'store/me'
import { StateAPI } from 'api/state'

function TaskDashboard() {
  const location = useLocation()
  const { user: me } = useSelector(selectMe)
  const [boardId, setBoardId] = useState<number | null>(null)
  const { loading: tasksLoading, tasks, updateTasks } = useBoardTasks(boardId)
  const { loading: tagsLoading, tags, updateTags } = useBoardTags(boardId)
  const {
    loading: statesLoading,
    states,
    updateStates
  } = useBoardStates(boardId)

  const numStates = useMemo(() => states.length, [states])

  useEffect(() => {
    const id = location.pathname.replace('/', '')
    if (!id) {
      return
    }
    setBoardId(parseInt(id))
  }, [location])

  const taskAPI = new TaskAPI()
  const tagAPI = new TagAPI()
  const stateAPI = new StateAPI()

  function createTask(form: CreateTaskForm, cb: () => void) {
    taskAPI
      .createTask({
        ...form,
        boardId: boardId!,
        stateId: form.stateId!,
        userId: me!.id
      })
      .then((res) => {
        if (res.error) {
          return
        }
        updateTasks([...tasks, res.data])
        useNotification({
          type: NotificationType.Success,
          message: 'Task has been created successfully'
        })
      })
      .finally(() => cb())
  }

  function deleteTask(taskId: number, cb: () => void) {
    taskAPI
      .deleteTask({ id: taskId })
      .then((res) => {
        if (res.error) {
          return
        }
        updateTasks(tasks.filter((task) => task.id !== taskId))
        useNotification({
          type: NotificationType.Success,
          message: 'Task has been deleted successfully'
        })
      })
      .finally(() => cb())
  }

  function editTask(form: EditTaskForm, cb: () => void) {
    taskAPI
      .editTask({ ...form, boardId: boardId!, userId: me!.id })
      .then((res) => {
        if (res.error) {
          return
        }
        updateTasks(tasks.map((t) => (t.id === res.data.id ? res.data : t)))
      })
      .finally(() => cb())
  }

  function createTag({
    name,
    color,
    cb
  }: {
    name: string
    color: Color
    cb: (tag: TagPrimitive) => void
  }) {
    tagAPI
      .createTag({
        name,
        color,
        boardId: boardId!
      })
      .then((res) => {
        if (res.error) {
          return
        }
        updateTags([...tags, res.data])
        cb(res.data)
      })
  }

  function createState(cb: () => void) {
    stateAPI
      .createState({
        name: 'Untitled',
        boardId: boardId!,
        currentPosition: numStates
      })
      .then((res) => {
        if (res.error) {
          return
        }
        updateStates([...states, res.data])
      })
      .finally(() => cb())
  }

  function useDragTask() {
    const task = useRef<Task | null>(null)

    function onDragTask(t: Task) {
      task.current = t
    }

    function onDragOver(e: React.DragEvent<HTMLDivElement>) {
      e.preventDefault()
    }

    function onDropTask(
      e: React.DragEvent<HTMLDivElement>,
      state: StatePrimitive
    ) {
      e.preventDefault()
      if (!task.current) {
        return
      }
      editTask(
        {
          ...task.current,
          stateId: state.id
        },
        () => (task.current = null)
      )
    }

    return {
      onDragTask,
      onDragOver,
      onDropTask
    }
  }

  function editState(newState: StatePrimitive) {
    stateAPI.editState({ ...newState, boardId: boardId! }).then((res) => {
      if (res.error) {
        return
      }
      updateStates(
        states.map((state) => (state.id === res.data.id ? res.data : state))
      )
    })
  }

  function deleteState(stateId: number, cb: () => void) {
    stateAPI
      .deleteState({ id: stateId })
      .then((res) => {
        if (res.error) {
          return
        }
        updateStates(states.filter((state) => state.id !== stateId))
        useNotification({
          type: NotificationType.Success,
          message: 'State has been deleted successfully'
        })
      })
      .finally(() => cb())
  }

  function onMoveStateLeft(state: StatePrimitive) {
    for (let i = 0; i < states.length; i++) {
      const s = states[i]
      if (s.id === state.id) {
        const prev = {
          ...states[i - 1],
          currentPosition: states[i - 1].currentPosition + 1,
          boardId: boardId!
        }
        const curr = {
          ...state,
          currentPosition: state.currentPosition - 1,
          boardId: boardId!
        }
        Promise.all([stateAPI.editState(prev), stateAPI.editState(curr)]).then(
          () => {
            const copied = states.map((s) =>
              s.id === prev.id ? prev : s.id === curr.id ? curr : s
            )
            copied.sort((a, b) => a.currentPosition - b.currentPosition)
            updateStates(copied)
          }
        )
        break
      }
    }
  }

  function onMoveStateRight(state: StatePrimitive) {
    for (let i = 0; i < states.length; i++) {
      const s = states[i]
      if (s.id === state.id) {
        const prev = {
          ...states[i + 1],
          currentPosition: states[i + 1].currentPosition - 1,
          boardId: boardId!
        }
        const curr = {
          ...state,
          currentPosition: state.currentPosition + 1,
          boardId: boardId!
        }
        Promise.all([stateAPI.editState(prev), stateAPI.editState(curr)]).then(
          () => {
            const copied = states.map((s) =>
              s.id === prev.id ? prev : s.id === curr.id ? curr : s
            )
            copied.sort((a, b) => a.currentPosition - b.currentPosition)
            updateStates(copied)
          }
        )
        break
      }
    }
  }

  const { onDragTask, onDragOver, onDropTask } = useDragTask()

  return (
    <div className="task-dashboard">
      <div className="card-boards">
        {statesLoading ? (
          <LoadingBar />
        ) : (
          states.map((state) => {
            return (
              <ListView
                key={state.id}
                tasks={tasks.filter((task) => task.stateId === state.id)}
                states={states}
                loading={tasksLoading || tagsLoading}
                tags={tags}
                state={state}
                position={{
                  current: state.currentPosition,
                  limit: numStates - 1
                }}
                events={{
                  onEditTask: editTask,
                  onCreateTask: createTask,
                  onCreateTag: createTag,
                  onDeleteTask: deleteTask,
                  onDragTask,
                  onDragOver,
                  onDropTask,
                  onEditState: editState,
                  onDeleteState: deleteState,
                  onMoveStateLeft,
                  onMoveStateRight
                }}
              />
            )
          })
        )}
        <ListViewPlaceholder events={{ createState }} />
      </div>
    </div>
  )
}

export default TaskDashboard
