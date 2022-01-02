import React, { Key, useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import {
  faHome,
  faPlus,
  faUser,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'
import { AuthAPI } from 'api/auth'
import { BoardPrimitive } from 'types/board'
import LoadingBar from 'components/molecules/LoadingBar'
import Tabs from 'components/molecules/Tabs'
import TabItem from 'components/molecules/TabItem'
import { useCreateBoard, useDeleteBoard, useEditBoard } from 'composables/board'
import Button from 'components/atoms/Button'
import ModalCard from 'components/molecules/ModalCard'
import FormBoardCreate, { Form } from './FormBoardCreate'
import { NotificationType, useNotification } from 'composables/notification'
import BoardHeader from 'components/organisms/BoardHeader'
import { selectBoards, setCurrentBoardId, updateBoards } from 'store/boards'
import { resetMe, selectMe } from 'store/me'
import { useMediaQuery } from 'utils/mediaQuery'
import DropdownSelect from 'components/molecules/DropdownSelect'
import DropdownMenu from 'components/molecules/DropdownMenu'
import './BoardTabs.scoped.css'

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
  const dispatch = useDispatch()
  const { isSmall } = useMediaQuery()

  const {
    boards,
    loading: boardsLoading,
    currentBoardId
  } = useSelector(selectBoards)
  const { user: me } = useSelector(selectMe)

  const {
    loading: createBoardLoading,
    error: createBoardError,
    createBoard: createBoard_
  } = useCreateBoard()
  const { error: editBoardError, editBoard: editBoard_ } = useEditBoard()
  const { error: deleteBoardError, deleteBoard: deleteBoard_ } =
    useDeleteBoard()

  const navigate = useNavigate()
  const location = useLocation()

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
        dispatch(setCurrentBoardId(boardId))
      } else {
        navigate('/')
      }
      return
    }

    selectBoard(currentBoardId)
  }, [boardsLoading])

  function selectBoard(id: number | null) {
    dispatch(setCurrentBoardId(id))
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
        dispatch(updateBoards([...boards, board]))
        // Navigate to the new board
        selectBoard(board.id)
        closeBoardCreateCard()
        useNotification({
          type: NotificationType.Success,
          message: 'Board has been created successfully'
        })
      })
      .finally(() => cb())
  }

  function editBoard(form: Form, cb: () => void) {
    editBoard_({ ...form, id: form.id! })
      .then((res) => {
        if (!res) {
          return
        }
        dispatch(
          updateBoards(
            boards.map((board) => (board.id === res.id ? res : board))
          )
        )
      })
      .finally(() => cb())
  }

  function deleteBoard(boardId: number, cb: () => void) {
    deleteBoard_(boardId)
      .then((res) => {
        if (!res) {
          return
        }
        dispatch(updateBoards(boards.filter((board) => board.id !== boardId)))
        useNotification({
          type: NotificationType.Success,
          message: 'Board has been deleted successfully'
        })
      })
      .finally(() => {
        cb()
        selectBoard(null)
      })
  }

  function logout() {
    const auth = new AuthAPI()
    useNotification({
      type: NotificationType.Info,
      message: 'Logging you out'
    })
    auth.logout().then((res) => {
      if (res.error) {
        useNotification({
          type: NotificationType.Error,
          message: res.error
        })
        return
      }
      dispatch(resetMe())
      useNotification({
        type: NotificationType.Info,
        message: 'Goodbye!'
      })
      navigate('/')
    })
  }

  const error = useMemo(
    () => createBoardError || editBoardError || deleteBoardError,
    [createBoardError, editBoardError, deleteBoardError]
  )

  const loading = useMemo(
    () => boardsLoading || createBoardLoading,
    [boardsLoading, createBoardLoading]
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
        <DropdownMenu
          closeOnContentClick={false}
          items={[
            <div key="" className="me-info">
              <span className="account-info">Account Information</span>
              <span>
                {me?.name} ({me?.email})
              </span>
              <Button
                icon={faSignOutAlt}
                label="Logout"
                events={{ onClick: logout }}
              />
            </div>
          ]}
          trigger={<Button className="is-ghost is-medium" icon={faUser} />}
        />
        <Button
          className={clsx({
            'is-ghost': true,
            'is-medium': true,
            'is-active': !currentBoardId
          })}
          icon={faHome}
          events={{ onClick: () => selectBoard(null) }}
        />
        {loading ? (
          <LoadingBar />
        ) : isSmall ? (
          <DropdownSelect
            initial={currentBoardId?.toString() as Key}
            items={boards.map((board) => {
              return <span key={board.id}>{board.name}</span>
            })}
            events={{
              onSelect: (key: Key | null) => selectBoard(key as number)
            }}
          />
        ) : (
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
        )}

        <Button
          className="is-ghost is-medium create-board-button"
          icon={faPlus}
          events={{ onClick: openBoardCreateCard }}
        />
      </div>
      {currentBoardId && (
        <BoardHeader
          boardId={currentBoardId}
          events={{ onEditBoard: editBoard, onDeleteBoard: deleteBoard }}
        />
      )}
    </div>
  )
}

export default BoardTabs
