import React, { Key, useState } from 'react'
import clsx from 'clsx'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import Button from 'components/atoms/Button'
import DropdownItem from './DropdownItem'
import Icon from 'components/atoms/Icon'
import './Dropdown.css'

type Props = {
  items: JSX.Element[]
  events: {
    onSelect: (key: Key | null) => any
  }
}

const Dropdown: React.FC<Props> = ({ items, events }) => {
  if (items.length === 0) {
    return null
  }
  const [active, setActive] = useState(false)
  const [selected, setSelected] = useState<Key | null>(items[0].key)

  function clickDropdown(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setActive(!active)
  }

  function onSelect(key: Key | null) {
    setSelected(key)
    // Close the dropdown
    setActive(false)
    events.onSelect(key)
  }

  return (
    <div
      className={clsx({
        dropdown: true,
        'is-active': active
      })}
    >
      <div className="dropdown-trigger">
        <Button
          attr={{ 'aria-haspopup': 'true', 'aria-controls': 'dropdown-menu' }}
          events={{ onClick: clickDropdown }}
        >
          <span>{items.find((item) => item.key === selected) ?? items[0]}</span>
          <span className="dropdown-icon">
            <Icon icon={faAngleDown} />
          </span>
        </Button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {items.reduce((acc, item) => {
            if (item.key === selected) {
              return acc
            }
            acc.push(
              <DropdownItem key={item.key} onSelect={() => onSelect(item.key)}>
                {item}
              </DropdownItem>
            )
            return acc
          }, [] as JSX.Element[])}
        </div>
      </div>
    </div>
  )
}

export default Dropdown
