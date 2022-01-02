import React from 'react'
import clsx from 'clsx'
import { BoardPrimitive } from 'types/board'

type Props = {
  board: BoardPrimitive
  className?: string
}

const CardBoard: React.FC<Props> = ({ board, className }) => {
  return (
    <div className={clsx({ card: true, [className ?? '']: true })}>
      <header className="card-header">
        <p className="card-header-title">{board.name}</p>
      </header>
      <div className="card-content">
        <div className="content"></div>
      </div>
    </div>
  )
}

export default CardBoard
