import clsx from 'clsx'
import React from 'react'
import './BoardTask.css'
import CardTask from '../molecules/CardTask'
import { Board } from 'types/board'

type Props = {
  board: Board
}

const BoardTask: React.FC<Props> = ({ board }) => {
  return (
    <div className="board">
      <span className={clsx({
        "board-title": true,
        "block": true,
      })}>{board.name}</span>
      <div className="tasks">
        {board.tasks.map(task => <CardTask key={task.id} name={task.name} description={task.description} />)}
      </div>
    </div>
  )
}

export default BoardTask
