import React, { useState } from 'react'
import clsx from 'clsx'
import Button from 'components/atoms/Button'
import { faEdit, faTrash, faTag } from '@fortawesome/free-solid-svg-icons'
import ModalCard from 'components/molecules/ModalCard'
import { useBoard } from 'composables/board'
import { BoardPrimitive } from 'types/board'
import FormBoardEdit, { Form } from './FormBoardEdit'
import './BoardHeader.css'
import FormTagsManage from './FormTagsManage'

type Props = {
  boardId: number | null
  events: {
    onEditBoard: (form: Form, cb: () => void) => any
    onDeleteBoard: (boardId: number, cb: () => void) => any
  }
}

function useBoardEditModal() {
  const [visible, setVisible] = useState(false)
  const [board, setBoard] = useState<BoardPrimitive>()

  function openCard(board: BoardPrimitive) {
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

function useBoardDeleteModal() {
  const [visible, setVisible] = useState(false)
  const [board, setBoard] = useState<BoardPrimitive>()

  function openCard(board: BoardPrimitive) {
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

function useTagsManageModal() {
  const [visible, setVisible] = useState(false)
  const [board, setBoard] = useState<BoardPrimitive>()

  function openCard(board: BoardPrimitive) {
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

const BoardHeader: React.FC<Props> = ({ boardId, events }) => {
  const { board, updateBoard } = useBoard(boardId)

  function onEditBoard(form: Form, cb: () => void) {
    events.onEditBoard(form, () => {
      cb()
      closeBoardEditCard()
      updateBoard({ ...form, id: form.id! })
    })
  }

  const [deletingBoard, setDeletingBoard] = useState(false)
  function onDeleteBoard(boardId: number) {
    setDeletingBoard(true)
    events.onDeleteBoard(boardId, () => {
      setDeletingBoard(false)
      closeBoardDeleteCard()
    })
  }

  const {
    board: openedBoardEdit,
    visible: isBoardEditing,
    openCard: openBoardEditCard,
    closeCard: closeBoardEditCard
  } = useBoardEditModal()

  const {
    board: openedBoardDelete,
    visible: isBoardDeleting,
    openCard: openBoardDeleteCard,
    closeCard: closeBoardDeleteCard
  } = useBoardDeleteModal()

  const {
    board: openedBoardTagsManage,
    visible: isTagsManaging,
    openCard: openTagsManageCard,
    closeCard: closeTagsManageCard
  } = useTagsManageModal()

  return (
    <div className="board-header">
      {openedBoardTagsManage && (
        <ModalCard
          visible={isTagsManaging}
          title="Manage tags"
          events={{ onClose: closeTagsManageCard }}
        >
          <FormTagsManage
            board={openedBoardTagsManage}
            events={{ onSubmit: closeTagsManageCard }}
          />
        </ModalCard>
      )}
      {openedBoardEdit && (
        <ModalCard
          visible={isBoardEditing}
          title="Edit board"
          events={{ onClose: closeBoardEditCard }}
        >
          <FormBoardEdit
            board={openedBoardEdit}
            events={{
              onSubmit: onEditBoard,
              onCancel: closeBoardEditCard
            }}
          />
        </ModalCard>
      )}
      {openedBoardDelete && (
        <ModalCard
          visible={isBoardDeleting}
          title="Delete board"
          events={{ onClose: closeBoardDeleteCard }}
        >
          <div>
            Are you sure you want to delete &quot;{openedBoardDelete.name}
            &quot;?
          </div>
          <div>This action is irreversible.</div>
          <div className="form-control">
            <Button
              type="button"
              className="is-light"
              label="Cancel"
              events={{ onClick: () => closeBoardDeleteCard() }}
            />
            <Button
              type="submit"
              className={clsx({
                'is-danger': true,
                'is-loading': deletingBoard
              })}
              attr={{ disabled: deletingBoard }}
              label="Delete"
              events={{ onClick: () => onDeleteBoard(openedBoardDelete.id) }}
            />
          </div>
        </ModalCard>
      )}
      {board && (
        <div className="board-information">
          <h1 className="title">{board.name}</h1>
          <div className="board-actions">
            <Button
              className="is-info is-light"
              icon={faTag}
              events={{ onClick: () => openTagsManageCard(board) }}
            />
            <Button
              className="is-link is-light"
              icon={faEdit}
              events={{ onClick: () => openBoardEditCard(board) }}
            />
            <Button
              className="is-danger is-light"
              icon={faTrash}
              events={{ onClick: () => openBoardDeleteCard(board) }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default BoardHeader
