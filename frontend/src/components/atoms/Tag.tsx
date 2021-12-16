import clsx from 'clsx'
import React from 'react'
import { Color, ColorToAlias } from 'types/common'
import './Tag.css'

type Props = {
  name: string
  color: Color
}

const Tag: React.FC<Props> = ({ name, color }) => {
  const derivedClass = 'is-' + ColorToAlias(color)
  return (
    <span
      className={clsx({
        tag: true,
        'is-light': true,
        [derivedClass]: true
      })}
    >
      {name}
    </span>
  )
}

export default Tag
