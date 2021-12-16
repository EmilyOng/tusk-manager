import LoadingBar from 'components/molecules/LoadingBar'
import Notification, { NotificationType } from 'components/molecules/Notification'
import BoardTask from 'components/organisms/BoardTask'
import './Dashboard.css'
import { useBoards } from 'composables/board'

function Dashboard() {
  const { loading, error, boards } = useBoards()

  if (loading) {
    return <LoadingBar />
  }
  if (error) {
    return <Notification type={NotificationType.Error} message={error} />
  }
  return (
    <div className="container boards">
      {boards.map(board => <BoardTask key={board.id} board={board} />)}
    </div>
  )
}

export default Dashboard
