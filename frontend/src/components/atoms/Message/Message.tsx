import clsx from 'clsx'
import React from 'react'
import './Message.scoped.css'

type Props = {
  type: 'success' | 'danger'
  text: string
}

const Message: React.FC<Props> = ({ type, text }) => {
  return (
    <p
      className={clsx({
        help: true,
        message: true,
        'is-danger': type === 'danger',
        'is-success': type === 'success'
      })}
    >
      {text}
    </p>
  )
}

export default Message
