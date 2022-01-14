import clsx from 'clsx'
import React from 'react'
import { Color } from 'generated/types'
import { ColorToAlias, Colors } from 'utils/color'
import { getSelectorHash } from 'utils/selectorHash'
import './TagItem.scoped.css'

type Props = {
  name: string
  color?: Color
  className?: string
}

const TagItem: React.FC<Props> = (props) => {
  const { name, color: color_, className, children } = props
  const color = color_ ?? Colors[name.length % Colors.length]
  const derivedClass = 'is-' + ColorToAlias(color)
  const baseTag = (
    <span
      className={clsx({
        tag: true,
        'is-light': true,
        [className ?? '']: true,
        [derivedClass]: true
      })}
      {...getSelectorHash(props)}
    >
      {name}
    </span>
  )
  if (!children) {
    return baseTag
  }
  return (
    <span
      className={clsx({
        tags: true,
        'has-addons': !!children
      })}
    >
      {baseTag}
      {children}
    </span>
  )
}

export default TagItem
