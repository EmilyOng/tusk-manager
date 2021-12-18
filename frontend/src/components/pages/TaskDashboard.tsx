import { useState } from 'react'
import ModalCard from 'components/molecules/ModalCard'
import { Task } from 'types/task'

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

function TaskDashboard() {
  const {
    task: openedTask,
    visible: visibleCard,
    // openCard,
    closeCard
  } = useModalCard()

  return (
    <div>
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
      Tasks
    </div>
  )
}

export default TaskDashboard
