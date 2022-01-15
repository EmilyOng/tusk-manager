import clsx from 'clsx'
import React from 'react'
import { getSelectorHash } from 'utils/selectorHash'
import './TagItemAddon.scoped.css'

type Props = {
  className?: string
  events: {
    onClick: () => any
  }
}

const TagItemAddon: React.FC<Props> = (props) => {
  const { className, events, children } = props
  return (
    <a
      className={clsx({
        tag: true,
        [className ?? '']: true
      })}
      {...getSelectorHash(props)}
      onClick={events.onClick}
    >
      {children}
    </a>
  )
}

export default TagItemAddon
