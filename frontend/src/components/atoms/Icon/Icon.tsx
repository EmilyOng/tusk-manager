import React from 'react'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps
} from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-common-types'

type Props = {
  icon: IconDefinition
  attr?: Partial<FontAwesomeIconProps>
}

const Icon: React.FC<Props> = ({ icon, attr }) => (
  <FontAwesomeIcon icon={icon} {...attr} />
)

export default Icon
