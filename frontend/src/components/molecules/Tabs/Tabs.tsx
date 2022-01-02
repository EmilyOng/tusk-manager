import React from 'react'
import './Tabs.scoped.css'

const Tabs: React.FC = ({ children }) => {
  return (
    <div className="tabs is-boxed is-fullwidth">
      <ul>{children}</ul>
    </div>
  )
}

export default Tabs
