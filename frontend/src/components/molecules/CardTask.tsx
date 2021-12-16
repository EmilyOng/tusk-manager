import React from 'react'
import './CardTask.css'

type Props = {
  name: string
  description?: string
}

const CardTask: React.FC<Props> = ({ name }) => {
  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">
          {name}
        </p>
        <button className="card-header-icon" aria-label="more options">
          <span className="icon">
            <i className="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </header>
    </div>
  )
}

export default CardTask
