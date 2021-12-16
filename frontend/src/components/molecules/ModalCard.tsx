import clsx from 'clsx'
import React from 'react'
import './ModalCard.css'

type Props = {
  title: string
  visible: boolean
  labels?: {
    ok?: string
    cancel?: string
  }
  events: {
    onClose: () => void
    onSubmit: () => void
  }
}

const ModalCard: React.FC<Props> = ({
  title,
  visible,
  labels,
  events,
  children
}) => {
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
          <button
            className="delete"
            aria-label="close"
            onClick={events.onClose}
          ></button>
        </header>
        <section className="modal-card-body">{children}</section>
        <footer className="modal-card-foot">
          <button className="button" onClick={events.onClose}>
            {labels?.cancel || 'Cancel'}
          </button>
          <button className="button is-success" onClick={events.onSubmit}>
            {labels?.ok || 'OK'}
          </button>
        </footer>
      </div>
    </div>
  )
}

export default ModalCard
