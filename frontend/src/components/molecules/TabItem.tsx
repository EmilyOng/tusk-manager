import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import clsx from 'clsx'
import React from 'react'
import Icon from '../atoms/Icon'

type Props = {
  label: string
  selected: boolean
  icon?: IconDefinition
  events?: {
    onClick: () => void
  }
}

const TabItem: React.FC<Props> = ({ label, selected, icon, events }) => {
  return (
    <li className={clsx({ 'is-active': selected })} {...events}>
      <a>
        {icon && (
          <span className="icon is-small">
            <Icon icon={icon} />
          </span>
        )}
        <span>{label}</span>
      </a>
    </li>
  )
}

export default TabItem
