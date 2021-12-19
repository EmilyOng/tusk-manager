import clsx from 'clsx'
import React from 'react'
import { Color, ColorToAlias, Colors } from 'types/common'
import './Tag.css'

export enum TagAction {
  Delete = 'Delete'
}

type Props = {
  name: string
  color?: Color
  action?: {
    type: TagAction
    onAction: () => any
  }
  className?: string
}

const Tag: React.FC<Props> = ({ name, color: color_, action, className }) => {
  const color = color_ ?? Colors[name.length % Colors.length]
  const derivedClass = 'is-' + ColorToAlias(color)
  return (
    <span
      className={clsx({
        tag: true,
        'is-light': true,
        [className ?? '']: true,
        [derivedClass]: true,
        'has-addons': !!action
      })}
    >
      <span>{name}</span>
      {action?.type === TagAction.Delete && (
        <a className="tag is-delete" onClick={action.onAction}></a>
      )}
    </span>
  )
}

export default Tag
