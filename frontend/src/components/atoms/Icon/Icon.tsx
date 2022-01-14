import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps
} from '@fortawesome/react-fontawesome'
import React from 'react'

type Props = {
  icon: IconDefinition
  attr?: Partial<FontAwesomeIconProps>
}

const Icon: React.FC<Props> = ({ icon, attr }) => (
  <FontAwesomeIcon icon={icon} {...attr} />
)

export default Icon
