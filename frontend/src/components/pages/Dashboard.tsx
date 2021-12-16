import { useState } from 'react'
import LoadingBar from 'components/molecules/LoadingBar'
import Notification, {
  NotificationType
} from 'components/molecules/Notification'
import BoardTask from 'components/organisms/BoardTask'
import ModalCard from 'components/molecules/ModalCard'
import { useBoards } from 'composables/board'
import { Task } from 'types/task'
import './Dashboard.css'

function useModalCard() {
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

function Dashboard() {
  const { loading, error, boards } = useBoards()
  const {
    task: openedTask,
    visible: visibleCard,
    openCard,
    closeCard
  } = useModalCard()

  if (loading) {
    return <LoadingBar />
  }
  if (error) {
    return <Notification type={NotificationType.Error} message={error} />
  }
  return (
    <div className="container boards">
      {openedTask && (
        <ModalCard
          visible={visibleCard}
          title={openedTask.name}
          labels={{ ok: 'Save changes' }}
          events={{ onClose: closeCard, onSubmit: () => {} }}
        />
      )}
      {boards.map((board) => (
        <BoardTask
          key={board.id}
          board={board}
          events={{ onOpenCard: openCard }}
        />
      ))}
    </div>
  )
}

export default Dashboard
