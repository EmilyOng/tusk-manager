import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import clsx from 'clsx'
import React, { RefObject } from 'react'
import Icon from 'components/atoms/Icon'

type Props = {
  label?: string
  selected: boolean
  icon?: IconDefinition
  className?: string
  ref?: RefObject<HTMLLIElement>
  events?: {
    onClick: () => void
  }
}

const TabItem: React.FC<Props> = ({
  label,
  selected,
  icon,
  className,
  ref,
  events
}) => {
  return (
    <li
      ref={ref}
      className={clsx({
        'is-active': selected,
        [className ?? '']: !!className
      })}
      {...events}
    >
      <a>
        {icon && (
          <span className="icon is-small">
            <Icon icon={icon} />
          </span>
        )}
        {label && <span>{label}</span>}
      </a>
    </li>
  )
}

export default TabItem
