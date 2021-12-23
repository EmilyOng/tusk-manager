import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import clsx from 'clsx'
import React from 'react'
import Icon from './Icon'

type Props = {
  className?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  icon?: IconDefinition
  iconPosition?: 'left' | 'right'
  label?: string
  attr?: Record<string, unknown>
  events?: {
    onClick?: any
  }
}

const Button: React.FC<Props> = ({
  className,
  type = 'button',
  icon,
  iconPosition = 'left',
  label,
  attr,
  events,
  children
}) => {
  const iconComponent = icon && (
    <span className="icon">
      <Icon icon={icon} />
    </span>
  )
  return (
    <button
      type={type}
      className={clsx({ button: true, [className ?? '']: true })}
      {...events}
      {...attr}
    >
      {icon && iconPosition === 'left' && iconComponent}
      {label && <span>{label}</span>}
      {children}
      {icon && iconPosition === 'right' && iconComponent}
    </button>
  )
}

export default Button
