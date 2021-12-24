import React, { useState } from 'react'
import Button from 'components/atoms/Button'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import ModalCard from 'components/molecules/ModalCard'
import { useBoard } from 'composables/board'
import { BoardPrimitive } from 'types/board'
import FormBoardEdit, { Form } from './FormBoardEdit'
import './BoardHeader.css'

type Props = {
  boardId: number | null
  events: {
    onEditBoard: (form: Form, cb: () => void) => any
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

const BoardHeader: React.FC<Props> = ({ boardId, events }) => {
  const { board, updateBoard } = useBoard(boardId)

  function onEditBoard(form: Form, cb: () => void) {
    events.onEditBoard(form, () => {
      cb()
      closeBoardEditCard()
      updateBoard({...form, id: form.id!})
    })
  }
 
  const {
    board: openedBoardEdit,
    visible: isBoardEditing,
    openCard: openBoardEditCard,
    closeCard: closeBoardEditCard
  } = useBoardEditModal()
  
  return (
    <div className="board-header">
      {openedBoardEdit && <ModalCard
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
      </ModalCard>}
      {board && <div className="board-information">
        <h1 className="title">{board.name}</h1>
        <div className="board-actions">
          <Button
            className="is-link is-light"
            icon={faEdit}
            events={{ onClick: () => openBoardEditCard(board) }}
          />
          <Button
            className="is-danger is-light"
            icon={faTrash}
          />
        </div>
      </div>}
    </div>
  )
}

export default BoardHeader
