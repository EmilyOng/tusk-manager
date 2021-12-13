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
      <CardTask name="Test" body="Test"/>
    </div>
  )
}

export default BoardTask
