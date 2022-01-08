import React from 'react'
import clsx from 'clsx'
import { getSelectorHash } from 'utils/selectorHash'
import { BoardPrimitive } from 'generated/models'

type Props = {
  board: BoardPrimitive
  className?: string
}

const CardBoard: React.FC<Props> = (props) => {
  const { board, className } = props
  return (
    <div
      className={clsx({ card: true, [className ?? '']: true })}
      {...getSelectorHash(props)}
    >
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
