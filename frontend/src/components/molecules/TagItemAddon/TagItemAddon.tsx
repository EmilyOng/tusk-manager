import clsx from 'clsx'
import React from 'react'

type Props = {
  className?: string
  events: {
    onClick: () => any
  }
}

const TagItemAddon: React.FC<Props> = ({ className, events, children }) => (
  <a
    className={clsx({
      tag: true,
      [className ?? '']: true
    })}
    onClick={events.onClick}
  >
    {children}
  </a>
)

export default TagItemAddon
