import React from 'react'
import FormBoard, { Form as Form_ } from 'components/molecules/FormBoard'
import { BoardPrimitive } from 'generated/models'

export type Form = Form_

type Props = {
  board: BoardPrimitive
  events: {
    onSubmit: (form: Form, cb: () => void) => any
    onCancel: () => any
  }
}

const FormBoardEdit: React.FC<Props> = ({ board, events }) => {
  return (
    <FormBoard
      initial={{ id: board.id, name: board.name, color: board.color }}
      events={events}
      actionLabels={{ ok: 'Edit' }}
    />
  )
}

export default FormBoardEdit
