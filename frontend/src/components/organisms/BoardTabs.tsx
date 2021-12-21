import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { faHome, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Board, BoardPrimitive } from 'types/board'
import LoadingBar from 'components/molecules/LoadingBar'
import Notification, {
  NotificationType
} from 'components/molecules/Notification'
import Tabs from 'components/molecules/Tabs'
import TabItem from 'components/molecules/TabItem'
import { useBoards, useCreateBoard } from 'composables/board'
import Button from 'components/atoms/Button'
import ModalCard from 'components/molecules/ModalCard'
import FormBoardCreate, { Form } from './FormBoardCreate'
import './BoardTabs.css'

function useBoardCreateModal() {
  const [visible, setVisible] = useState(false)
  const [board, setBoard] = useState<Board>()
  function openCard(board: Board) {
    setBoard(board)
    setVisible(true)
  }
  function closeCard() {
    setBoard(undefined)
    setVisible(false)
  }
  return {
    board,
    visible,
    openCard,
    closeCard
  }
}

const BoardTabs: React.FC = () => {
  const {
    loading: boardsLoading,
    error: boardsError,
    boards,
    updateBoards
  } = useBoards()
  const {
    loading: createBoardLoading,
    error: createBoardError,
    createBoard: createBoard_
  } = useCreateBoard()

  const navigate = useNavigate()
  const location = useLocation()
  const [currentBoardId, setCurrentBoardId] = useState<number | null>(null)

  const {
    board: openedBoardCreate,
    visible: isBoardCreating,
    openCard: openBoardCreateCard,
    closeCard: closeBoardCreateCard
  } = useBoardCreateModal()

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

  function createBoard(form: Form, cb: () => void) {
    createBoard_(form)
      .then((board: BoardPrimitive | null) => {
        if (!board) {
          return
        }
        updateBoards([...boards, board])
        // Navigate to the new board
        selectBoard(board.id)
        closeBoardCreateCard()
      })
      .finally(() => cb())
  }

  if (boardsLoading || createBoardLoading) {
    return <LoadingBar />
  }

  return (
    <div className="tabs-container">
      {(boardsError || createBoardError) && (
        <Notification
          type={NotificationType.Error}
          message={boardsError || createBoardError}
        />
      )}
      {openedBoardCreate && (
        <ModalCard
          visible={isBoardCreating}
          title="Create a new board"
          events={{ onClose: closeBoardCreateCard }}
        >
          <FormBoardCreate
            events={{
              onSubmit: createBoard,
              onCancel: closeBoardCreateCard
            }}
          />
        </ModalCard>
      )}
      <Button
        className={clsx({
          'is-info': true,
          'is-light': true,
          'is-active': !currentBoardId
        })}
        icon={faHome}
        events={{ onClick: () => selectBoard(null) }}
      />
      <Tabs>
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

      <Button
        className="is-link is-light"
        icon={faPlus}
        events={{ onClick: openBoardCreateCard }}
      />
    </div>
  )
}

export default BoardTabs
