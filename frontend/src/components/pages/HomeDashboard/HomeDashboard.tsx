import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { useSelector, useDispatch } from 'react-redux'
import { faBan, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { selectBoards, setCurrentBoardId, updateBoards } from 'store/boards'
import { selectMe } from 'store/me'
import Icon from 'components/atoms/Icon'
import Button from 'components/atoms/Button'
import { useNavigate } from 'react-router-dom'
import { useCreateBoard } from 'composables/board'
import { useNotification, NotificationType } from 'composables/notification'
import { BoardPrimitive } from 'types/board'
import ModalCard from 'components/molecules/ModalCard'
import FormBoardCreate, { Form } from 'components/organisms/FormBoardCreate'
import CardBoard from 'components/molecules/CardBoard'
import InputField from 'components/molecules/InputField'
import './HomeDashboard.scoped.css'
import LoadingBar from 'components/molecules/LoadingBar'

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

function HomeDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user: me } = useSelector(selectMe)
  const { boards, loading: boardsLoading } = useSelector(selectBoards)
  const hasNoBoards = useMemo(
    () => !boardsLoading && boards.length === 0,
    [boards, boardsLoading]
  )
  const [filteredBoards, setFilteredBoards] = useState<BoardPrimitive[]>([])
  useEffect(() => {
    setFilteredBoards(boards)
    return () => {
      setFilteredBoards([])
    }
  }, [boards])

  const { error: createBoardError, createBoard: createBoard_ } =
    useCreateBoard()

  const {
    visible: isBoardCreating,
    openCard: openBoardCreateCard,
    closeCard: closeBoardCreateCard
  } = useBoardCreateModal()

  const error = useMemo(() => createBoardError, [createBoardError])

  useEffect(() => {
    if (!error) {
      return
    }
    useNotification({
      type: NotificationType.Error,
      message: error
    })
  }, [error])

  function createBoard(form: Form, cb: () => void) {
    createBoard_(form)
      .then((board: BoardPrimitive | null) => {
        if (!board) {
          return
        }
        dispatch(updateBoards([...boards, board]))
        dispatch(setCurrentBoardId(board.id))
        // Navigate to the new board
        navigate(`/${board.id}`)
        closeBoardCreateCard()
        useNotification({
          type: NotificationType.Success,
          message: 'Board has been created successfully'
        })
      })
      .finally(() => cb())
  }

  const [searchBoardInput, setSearchBoardInput] = useState('')

  function onSearchBoard(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setSearchBoardInput(value)
    if (value.length === 0) {
      setFilteredBoards(boards)
      return
    }
    const matches = boards.filter((board) =>
      board.name.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredBoards(matches)
  }

  function selectBoard(boardId: number) {
    dispatch(setCurrentBoardId(boardId))
    navigate(`/${boardId}`)
  }

  return (
    <div className="home">
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

      <div className="has-boards">
        <h1 className="title">Welcome, {me?.name}!</h1>
        {hasNoBoards ? (
          <div className="has-no-boards">
            <Icon icon={faBan} attr={{ size: '4x' }} />
            <h1 className="title">No boards here</h1>
            <Button
              className="is-info"
              icon={faPlus}
              label="Create a new board"
              events={{ onClick: openBoardCreateCard }}
            />
          </div>
        ) : boardsLoading ? (
          <LoadingBar />
        ) : (
          <div>
            <InputField
              name="boards"
              type="text"
              value={searchBoardInput}
              label=""
              icon={faSearch}
              placeholder="Search boards"
              events={{ onChange: onSearchBoard }}
            />
            <div className="boards">
              {filteredBoards.map((board) => (
                <div key={board.id} onClick={() => selectBoard(board.id)}>
                  <CardBoard
                    board={board}
                    className={clsx({ board: true, [board.color]: true })}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeDashboard
