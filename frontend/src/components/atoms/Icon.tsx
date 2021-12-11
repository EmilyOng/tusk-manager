import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-common-types'

type Props = {
  icon: IconDefinition
}

const Icon: React.FC<Props> = ({ icon }) => <FontAwesomeIcon icon={icon} />

export default Icon
