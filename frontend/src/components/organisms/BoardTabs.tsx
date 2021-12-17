import { faHome } from '@fortawesome/free-solid-svg-icons'
import LoadingBar from 'components/molecules/LoadingBar'
import Notification, {
  NotificationType
} from 'components/molecules/Notification'
import Tabs from 'components/molecules/Tabs'
import TabItem from 'components/molecules/TabItem'
import { useSelectableBoards } from 'composables/board'
import { useNavigate } from 'react-router-dom'

function BoardTabs() {
  const {
    loading: boardsLoading,
    error: boardsError,
    boards,
    updateBoards
  } = useSelectableBoards()
  const navigate = useNavigate()
  function selectBoard(id: string) {
    navigate(`/${id}`)
    updateBoards(
      boards.map((board) => {
        return { ...board, selected: board.id === id }
      })
    )
  }

  if (boardsLoading) {
    return <LoadingBar />
  }
  if (boardsError) {
    return <Notification type={NotificationType.Error} message={boardsError} />
  }
  return (
    <Tabs>
      <TabItem label="Dashboard" selected={true} icon={faHome} />
      {boards.map((board) => {
        return (
          <TabItem
            key={board.id}
            label={board.name}
            selected={board.selected}
            events={{ onClick: () => selectBoard(board.id) }}
          />
        )
      })}
    </Tabs>
  )
}

export default BoardTabs
