import React from 'react'
import clsx from 'clsx'
import './BoardTask.css'
import CardTask from '../molecules/CardTask'
import { Board } from 'types/board'
import { Task } from 'types/task'

type Props = {
  board: Board
  events: {
    onOpenCard: (task: Task) => void
  }
}

const BoardTask: React.FC<Props> = ({ board, events }) => {
  return (
    <div className={clsx({
      'board': true,
      [board.color]: true
    })}>
      <div className="board-title">{board.name}</div>
      <div className="tasks">
        {board.tasks.map(task => <CardTask key={task.id} task={task} events={{...events}} />)}
      </div>
    </div>
  )
}

export default BoardTask
