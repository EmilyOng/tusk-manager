import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { faHome, faPlus } from '@fortawesome/free-solid-svg-icons'
import { BoardPrimitive } from 'types/board'
import LoadingBar from 'components/molecules/LoadingBar'
import Tabs from 'components/molecules/Tabs'
import TabItem from 'components/molecules/TabItem'
import { useBoards, useCreateBoard, useEditBoard } from 'composables/board'
import Button from 'components/atoms/Button'
import ModalCard from 'components/molecules/ModalCard'
import FormBoardCreate, { Form } from './FormBoardCreate'
import { NotificationType, useNotification } from 'composables/notification'
import BoardHeader from 'components/organisms/BoardHeader'
import './BoardTabs.css'

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
  const { error: editBoardError, editBoard: editBoard_ } = useEditBoard()

  const navigate = useNavigate()
  const location = useLocation()
  const [currentBoardId, setCurrentBoardId] = useState<number | null>(null)

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

  function editBoard(form: Form, cb: () => void) {
    editBoard_({ ...form, id: form.id! })
      .then((res) => {
        if (!res) {
          return
        }
        updateBoards(boards.map((board) => (board.id === res.id ? res : board)))
      })
      .finally(() => cb())
  }

  const error = useMemo(
    () => boardsError || createBoardError || editBoardError,
    [boardsError, createBoardError, editBoardError]
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
        {(boardsLoading || createBoardLoading) && <LoadingBar />}
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
      {currentBoardId && (
        <BoardHeader
          boardId={currentBoardId}
          events={{ onEditBoard: editBoard }}
        />
      )}
    </div>
  )
}

export default BoardTabs
