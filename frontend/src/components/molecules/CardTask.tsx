import React from 'react'

type Props = {
  name: string
  body?: string
}

const CardTask: React.FC<Props> = ({ name, body }) => {
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
      {body && <div className="card-content">
        <div className="content">{body}</div>
      </div>}
      <footer className="card-footer">
        
      </footer>
    </div>
  )
}

export default CardTask
