import React, { Key } from 'react'
import { Colors, Color } from 'types/common'
import DropdownSelect from '../DropdownSelect'
import SquareColor from '../SquareColor'
import './DropdownColor.scoped.css'

type Props = {
  initialColor?: string
  events: {
    onSelect: (key: Key | null) => any
  }
}

const DropdownColor: React.FC<Props> = ({ initialColor, events }) => {
  const colorItems = Colors.map((color) => {
    return (
      <div key={color} className="color-dropdown-item">
        <SquareColor color={color} />
        <span>{color}</span>
      </div>
    )
  })

  if (initialColor) {
    colorItems.sort((a, b) => {
      const aKey = a.key as Color
      const bKey = b.key as Color
      if (aKey === initialColor) {
        return -1
      }
      if (bKey === initialColor) {
        return 1
      }
      return 0
    })
  }

  return (
    <DropdownSelect
      items={colorItems}
      events={{
        onSelect: events.onSelect
      }}
    />
  )
}

export default DropdownColor
