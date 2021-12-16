import React from 'react'
import './BoardTask.css'
import CardTask from '../molecules/CardTask'
import { Board } from 'types/board'
import clsx from 'clsx'

type Props = {
  board: Board
}

const BoardTask: React.FC<Props> = ({ board }) => {
  return (
    <div className={clsx({
      'board': true,
      [board.color]: true
    })}>
      <div className="board-title">{board.name}</div>
      <div className="tasks">
        {board.tasks.map(task => <CardTask key={task.id} task={task}/>)}
      </div>
    </div>
  )
}

export default BoardTask
