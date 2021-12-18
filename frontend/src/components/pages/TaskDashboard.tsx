import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ModalCard from 'components/molecules/ModalCard'
import { State, Task } from 'types/task'
import { orderTasksByState, useTasks } from 'composables/task'
import LoadingBar from 'components/molecules/LoadingBar'
import Notification, {
  NotificationType
} from 'components/molecules/Notification'
import ListView from 'components/organisms/ListView'
import './TaskDashboard.css'

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

function TaskDashboard() {
  const location = useLocation()
  const [boardId, setBoardId] = useState<number | null>(null)
  const { loading: tasksLoading, error: tasksError, tasks } = useTasks(boardId)
  const orderedTasks = orderTasksByState(tasks)

  useEffect(() => {
    const id = location.pathname.replace('/', '')
    if (!id) {
      return
    }
    setBoardId(parseInt(id))
  }, [location])

  const {
    task: openedTaskEdit,
    visible: isTaskEditing,
    openCard: openTaskEditCard,
    closeCard: closeTaskEditCard
  } = useTaskEditModal()

  if (tasksLoading) {
    return <LoadingBar />
  }
  if (tasksError) {
    return <Notification type={NotificationType.Error} message={tasksError} />
  }

  return (
    <div className="task-dashboard">
      {openedTaskEdit && (
        <ModalCard
          visible={isTaskEditing}
          title={openedTaskEdit.name}
          events={{ onClose: closeTaskEditCard }}
        >
          <p>hi</p>
        </ModalCard>
      )}
      <div className="card-boards">
        <ListView
          tasks={orderedTasks[State.Unstarted]}
          state={State.Unstarted}
          events={{ onOpenCard: openTaskEditCard }}
        />
        <ListView
          tasks={orderedTasks[State.InProgress]}
          state={State.InProgress}
          events={{ onOpenCard: openTaskEditCard }}
        />
        <ListView
          tasks={orderedTasks[State.Completed]}
          state={State.Completed}
          events={{ onOpenCard: openTaskEditCard }}
        />
      </div>
    </div>
  )
}

export default TaskDashboard
