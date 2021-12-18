import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { State } from 'types/task'
import { orderTasksByState, useCreateTask, useTasks } from 'composables/task'
import LoadingBar from 'components/molecules/LoadingBar'
import Notification, {
  NotificationType
} from 'components/molecules/Notification'
import ListView from 'components/organisms/ListView'
import './TaskDashboard.css'
import { Form } from 'components/organisms/FormTaskCreate'

function TaskDashboard() {
  const location = useLocation()
  const [boardId, setBoardId] = useState<number | null>(null)
  const {
    loading: tasksLoading,
    error: tasksError,
    tasks,
    updateTasks
  } = useTasks(boardId)
  const orderedTasks = orderTasksByState(tasks)

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
        updateTasks([...tasks, { ...task, tags: [] }])
      })
      .finally(() => cb())
  }

  if (tasksLoading) {
    return <LoadingBar />
  }

  return (
    <div className="task-dashboard">
      {(tasksError || createTaskError) && (
        <Notification type={NotificationType.Error} message={createTaskError} />
      )}
      <div className="card-boards">
        <ListView
          tasks={orderedTasks[State.Unstarted]}
          state={State.Unstarted}
          events={{ onEditTask: () => {}, onCreateTask: createTask }}
        />
        <ListView
          tasks={orderedTasks[State.InProgress]}
          state={State.InProgress}
          events={{ onEditTask: () => {}, onCreateTask: createTask }}
        />
        <ListView
          tasks={orderedTasks[State.Completed]}
          state={State.Completed}
          events={{ onEditTask: () => {}, onCreateTask: createTask }}
        />
      </div>
    </div>
  )
}

export default TaskDashboard
