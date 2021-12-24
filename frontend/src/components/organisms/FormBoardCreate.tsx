import React from 'react'
import FormBoard, { Form as Form_ } from '../molecules/FormBoard'

export type Form = Form_

type Props = {
  events: {
    onSubmit: (form: Form, cb: () => void) => any
    onCancel: () => any
  }
}

const FormBoardCreate: React.FC<Props> = ({ events }) => {
  return <FormBoard events={events} actionLabels={{ ok: 'Create' }} />
}

export default FormBoardCreate
