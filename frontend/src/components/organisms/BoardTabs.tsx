import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import LoadingBar from 'components/molecules/LoadingBar'
import Notification, {
  NotificationType
} from 'components/molecules/Notification'
import Tabs from 'components/molecules/Tabs'
import TabItem from 'components/molecules/TabItem'
import { useBoards } from 'composables/board'
import './BoardTabs.css'

function BoardTabs() {
  const { loading: boardsLoading, error: boardsError, boards } = useBoards()

  const navigate = useNavigate()
  const location = useLocation()
  const [currentBoardId, setCurrentBoardId] = useState<number | null>(null)

  useEffect(() => {
    if (boardsLoading) {
      return
    }
    // Redirect to the correct tab when boards are loaded
    const boardId_ = location.pathname.replace('/', '')
    const boardId = boardId_ ? parseInt(boardId_) : null
    if (!currentBoardId) {
      if (boardId) {
        setCurrentBoardId(boardId)
      } else {
        navigate('/')
      }
      return
    }

    selectBoard(currentBoardId)
  }, [boardsLoading])

  function selectBoard(id: number | null) {
    setCurrentBoardId(id)
    if (!id) {
      navigate('/')
      return
    }
    navigate(`/${id}`)
  }

  if (boardsLoading) {
    return <LoadingBar />
  }
  if (boardsError) {
    return <Notification type={NotificationType.Error} message={boardsError} />
  }
  return (
    <Tabs>
      <TabItem
        selected={!currentBoardId}
        icon={faHome}
        events={{ onClick: () => selectBoard(null) }}
      />
      {boards.map((board) => {
        return (
          <TabItem
            key={board.id}
            className={clsx({ 'board-tab': true, [board.color]: true })}
            label={board.name}
            selected={board.id === currentBoardId}
            events={{ onClick: () => selectBoard(board.id) }}
          />
        )
      })}
    </Tabs>
  )
}

export default BoardTabs
