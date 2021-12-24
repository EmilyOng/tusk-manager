import React from 'react'
import FormBoard, { Form as Form_ } from '../molecules/FormBoard'

export type Form = Form_

type Props = {
  board: Form
  events: {
    onSubmit: (form: Form, cb: () => void) => any
    onCancel: () => any
  }
}

const FormBoardEdit: React.FC<Props> = ({ board, events }) => {
  return (
    <FormBoard initial={board} events={events} actionLabels={{ ok: 'Edit' }} />
  )
}

export default FormBoardEdit
