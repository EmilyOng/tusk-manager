import React, { useState } from 'react'
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import Button from 'components/atoms/Button'

type Props = {
  events: {
    onFilterReverse: () => any
  }
}

const FilterReverse: React.FC<Props> = ({ events }) => {
  const [reversed, setReversed] = useState(false)

  function onFilterReverse() {
    const r = !reversed
    setReversed(r)
    events.onFilterReverse()
  }

  return (
    <Button
      icon={reversed ? faSortDown : faSortUp}
      events={{ onClick: onFilterReverse }}
    />
  )
}

export default FilterReverse
