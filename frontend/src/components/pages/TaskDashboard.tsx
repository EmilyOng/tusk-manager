import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { State } from 'types/task'
import { orderTasksByState, useCreateTask, useTasks } from 'composables/task'
import LoadingBar from 'components/molecules/LoadingBar'
import Notification, {
  NotificationType
} from 'components/molecules/Notification'
import ListView from 'components/organisms/ListView'
import { Form } from 'components/organisms/FormTaskCreate'
import { useTags } from 'composables/tag'
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
  const { loading: tagsLoading, error: tagsError, tags } = useTags(boardId)
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

  if (tasksLoading || tagsLoading) {
    return <LoadingBar />
  }

  return (
    <div className="task-dashboard">
      {(tasksError || createTaskError || tagsError) && (
        <Notification
          type={NotificationType.Error}
          message={tasksError || createTaskError || tagsError}
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
              events={{ onEditTask: () => {}, onCreateTask: createTask }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default TaskDashboard
