import clsx from 'clsx'
import React from 'react'
import './BoardTask.css'
import CardTask from '../molecules/CardTask'
import { Category } from 'types/category'

type Props = {
  category: Category
}

const BoardTask: React.FC<Props> = ({ category }) => {
  return (
    <div className="board">
      <span className={clsx({
        "board-title": true,
        "block": true,
      })}>{category.name}</span>
      <div className="tasks">
        {category.tasks.map(task => <CardTask key={task.id} name={task.name} description={task.description} />)}
      </div>
    </div>
  )
}

export default BoardTask
