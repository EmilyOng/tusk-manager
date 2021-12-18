import React from 'react'

type Props = {
  onSelect: any
}

const DropdownItem: React.FC<Props> = ({ onSelect, children }) => (
  <a className="dropdown-item" onClick={onSelect}>
    {children}
  </a>
)

export default DropdownItem
