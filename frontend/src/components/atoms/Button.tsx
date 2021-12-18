import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import clsx from 'clsx'
import React from 'react'
import Icon from './Icon'

type Props = {
  className?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  icon?: IconDefinition
  label?: string
  attr?: Record<string, unknown>
  events?: {
    onClick: any
  }
}

const Button: React.FC<Props> = ({
  className,
  type = 'button',
  icon,
  label,
  attr,
  events,
  children
}) => {
  return (
    <button
      type={type}
      className={clsx({ button: true, [className ?? '']: true })}
      {...events}
      {...attr}
    >
      {icon && (
        <span className="icon">
          <Icon icon={icon} />
        </span>
      )}
      {label && <span>{label}</span>}
      {children}
    </button>
  )
}

export default Button
