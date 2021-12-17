import React from 'react'
import './Tabs.css'

const Tabs: React.FC = ({ children }) => {
  return (
    <div className="tabs is-boxed">
      <ul>{children}</ul>
    </div>
  )
}

export default Tabs
