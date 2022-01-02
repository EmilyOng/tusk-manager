import clsx from 'clsx'
import React from 'react'
import { Color, ColorToAlias, Colors } from 'types/common'

type Props = {
  name: string
  color?: Color
  className?: string
}

const TagItem: React.FC<Props> = ({
  name,
  color: color_,
  className,
  children
}) => {
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
