import React from 'react'
import './DropdownItem.scoped.css'

type Props = {
  onSelect: any
}

const DropdownItem: React.FC<Props> = ({ onSelect, children }) => (
  <span className="dropdown-item" onClick={onSelect}>
    {children}
  </span>
)

export default DropdownItem
