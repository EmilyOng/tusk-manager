import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { faHome, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { BoardPrimitive } from 'types/board'
import LoadingBar from 'components/molecules/LoadingBar'
import Tabs from 'components/molecules/Tabs'
import TabItem from 'components/molecules/TabItem'
import { useBoard, useBoards, useCreateBoard } from 'composables/board'
import Button from 'components/atoms/Button'
import ModalCard from 'components/molecules/ModalCard'
import FormBoardCreate, { Form } from './FormBoardCreate'
import './BoardTabs.css'
import { NotificationType, useNotification } from 'composables/notification'

function useBoardCreateModal() {
  const [visible, setVisible] = useState(false)

  function openCard() {
    setVisible(true)
  }
  function closeCard() {
    setVisible(false)
  }
  return {
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
  const { board } = useBoard(currentBoardId)

  const {
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

  const error = useMemo(
    () => boardsError || createBoardError,
    [boardsError, createBoardError]
  )

  useEffect(() => {
    if (!error) {
      return
    }
    useNotification({
      type: NotificationType.Error,
      message: error
    })
  }, [error])

  if (boardsLoading || createBoardLoading) {
    return <LoadingBar />
  }

  return (
    <div className="board-tabs">
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
      <div className="tabs-container">
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
      <div className="board-information">
        <h1 className="title">{board?.name}</h1>
        <div className="board-actions">
          <Button
            className="is-link is-light"
            icon={faEdit}
          />
          <Button
            className="is-danger is-light"
            icon={faTrash}
          />
        </div>
      </div>
    </div>
  )
}

export default BoardTabs
