import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { State, Task } from 'types/task'
import { Color } from 'types/common'
import { TagPrimitive } from 'types/tag'
import {
  orderTasksByState,
  useCreateTask,
  useEditTask,
  useTasks
} from 'composables/task'
import LoadingBar from 'components/molecules/LoadingBar'
import Notification, {
  NotificationType
} from 'components/molecules/Notification'
import ListView from 'components/organisms/ListView'
import { Form as CreateTaskForm } from 'components/organisms/FormTaskCreate'
import { Form as EditTaskForm } from 'components/organisms/FormTaskEdit'
import { useCreateTag, useTags } from 'composables/tag'
import './TaskDashboard.css'

function TaskDashboard() {
  const location = useLocation()
  const [boardId, setBoardId] = useState<number | null>(null)
  const {
    loading: tasksLoading,
    error: tasksError,
    tasks,
    updateTasks
  } = useTasks(boardId)
  const { error: createTagError, createTag: createTag_ } = useCreateTag()
  const {
    loading: tagsLoading,
    error: tagsError,
    tags,
    updateTags
  } = useTags(boardId)
  const orderedTasks = orderTasksByState(tasks)
  const states = [State.Unstarted, State.InProgress, State.Completed]

  useEffect(() => {
    const id = location.pathname.replace('/', '')
    if (!id) {
      return
    }
    setBoardId(parseInt(id))
  }, [location])

  const { error: createTaskError, createTask: createTask_ } = useCreateTask()
  const { error: updateTaskError, editTask: editTask_ } = useEditTask()

  function createTask(form: CreateTaskForm, cb: () => void) {
    createTask_({ ...form, boardId: boardId! })
      .then((task) => {
        if (!task) {
          return
        }
        updateTasks([...tasks, task])
      })
      .finally(() => cb())
  }

  function editTask(form: EditTaskForm, cb: () => void) {
    editTask_({ ...form, boardId: boardId! })
      .then((task) => {
        if (!task) {
          return
        }
        updateTasks(tasks.map((t) => (t.id === task.id ? task : t)))
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
    createTag_({
      name,
      color,
      boardId: boardId!
    }).then((tag) => {
      if (!tag) {
        return
      }
      updateTags([...tags, tag])
      cb(tag)
    })
  }

  function useDragTask() {
    const task = useRef<Task | null>(null)

    function onDragTask(t: Task) {
      task.current = t
    }

    function onDragOver(e: React.DragEvent<HTMLDivElement>) {
      e.preventDefault()
    }

    function onDropTask(e: React.DragEvent<HTMLDivElement>, state: State) {
      e.preventDefault()
      if (!task.current) {
        return
      }
      editTask(
        {
          ...task.current,
          state
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

  const { onDragTask, onDragOver, onDropTask } = useDragTask()

  if (tasksLoading || tagsLoading) {
    return <LoadingBar />
  }

  return (
    <div className="task-dashboard">
      {(tasksError ||
        createTaskError ||
        tagsError ||
        createTagError ||
        updateTaskError) && (
        <Notification
          type={NotificationType.Error}
          message={
            tasksError ||
            createTaskError ||
            tagsError ||
            createTagError ||
            updateTaskError
          }
        />
      )}
      <div className="card-boards">
        {states.map((state) => {
          return (
            <ListView
              key={state}
              tasks={orderedTasks[state]}
              tags={tags}
              state={state}
              events={{
                onEditTask: editTask,
                onCreateTask: createTask,
                onCreateTag: createTag,
                onDragTask,
                onDragOver,
                onDropTask
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default TaskDashboard
