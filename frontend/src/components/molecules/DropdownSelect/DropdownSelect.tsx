import React, { Key, useState } from 'react'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import Button from 'components/atoms/Button'
import DropdownMenu from '../DropdownMenu'
import './DropdownSelect.scoped.css'

type Props = {
  initial?: Key
  items: JSX.Element[]
  events: {
    onSelect: (key: Key | null) => any
  }
}

const DropdownSelect: React.FC<Props> = ({ initial, items, events }) => {
  if (items.length === 0) {
    return null
  }

  const [selected, setSelected] = useState<Key | null>(initial ?? items[0].key)

  function onSelectDropdownItem(key: Key | null) {
    setSelected(key)
    // Close the dropdown
    events.onSelect(key)
  }

  const dropdownTrigger: JSX.Element = (
    <Button icon={faAngleDown} iconPosition="right">
      {items.find((item) => item.key === selected) ?? items[0]}
    </Button>
  )

  return (
    <DropdownMenu
      items={items.reduce((acc, item) => {
        if (item.key === selected) {
          return acc
        }
        acc.push(<div key={item.key}>{item}</div>)
        return acc
      }, [] as JSX.Element[])}
      trigger={dropdownTrigger}
      events={{ onClickDropdownItem: onSelectDropdownItem }}
    />
  )
}

export default DropdownSelect
