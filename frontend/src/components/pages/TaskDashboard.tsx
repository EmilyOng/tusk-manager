import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { State } from 'types/task'
import { Color } from 'types/common'
import { TagPrimitive } from 'types/tag'
import { orderTasksByState, useCreateTask, useTasks } from 'composables/task'
import LoadingBar from 'components/molecules/LoadingBar'
import Notification, {
  NotificationType
} from 'components/molecules/Notification'
import ListView from 'components/organisms/ListView'
import { Form } from 'components/organisms/FormTaskCreate'
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

  function createTask(form: Form, cb: () => void) {
    createTask_({ ...form, boardId: boardId! })
      .then((task) => {
        if (!task) {
          return
        }
        updateTasks([...tasks, task])
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

  if (tasksLoading || tagsLoading) {
    return <LoadingBar />
  }

  return (
    <div className="task-dashboard">
      {(tasksError || createTaskError || tagsError || createTagError) && (
        <Notification
          type={NotificationType.Error}
          message={tasksError || createTaskError || tagsError || createTagError}
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
                onEditTask: () => {},
                onCreateTask: createTask,
                onCreateTag: createTag
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default TaskDashboard
