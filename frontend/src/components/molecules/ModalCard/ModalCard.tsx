import { faTimes } from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'
import React from 'react'
import Button from 'components/atoms/Button'
import './ModalCard.scoped.css'

type Props = {
  title: string
  visible: boolean
  labels?: {
    ok?: string
    cancel?: string
  }
  events: {
    onClose: () => void
  }
}

const ModalCard: React.FC<Props> = ({ title, visible, events, children }) => {
  if (!visible) {
    return null
  }
  return (
    <div
      className={clsx({
        modal: true,
        'is-active': visible
      })}
    >
      <div className="modal-background" onClick={events.onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <Button events={{ onClick: events.onClose }} icon={faTimes} />
        </header>
        <section className="modal-card-body">{children}</section>
      </div>
    </div>
  )
}

export default ModalCard
