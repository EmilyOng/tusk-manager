import { useState } from 'react'
import ModalCard from 'components/molecules/ModalCard'
import BoardTabs from 'components/organisms/BoardTabs'
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
  const {
    task: openedTask,
    visible: visibleCard,
    // openCard,
    closeCard
  } = useModalCard()

  return (
    <div className="container dashboard">
      {openedTask && (
        <ModalCard
          visible={visibleCard}
          title={openedTask.name}
          labels={{ ok: 'Save changes' }}
          events={{ onClose: closeCard, onSubmit: () => {} }}
        >
          <p>hi</p>
        </ModalCard>
      )}
      <BoardTabs />
    </div>
  )
}

export default Dashboard
