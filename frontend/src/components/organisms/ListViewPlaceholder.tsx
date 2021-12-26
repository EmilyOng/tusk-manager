import React, { useState } from 'react'
import clsx from 'clsx'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Button from 'components/atoms/Button'
import Icon from 'components/atoms/Icon'
import './ListViewPlaceholder.css'

type Props = {
  events: {
    createState: (cb: () => void) => any
  }
}

const ListViewPlaceholder: React.FC<Props> = ({ events }) => {
  const [creatingState, setCreatingState] = useState(false)
  function createState() {
    events.createState(() => setCreatingState(false))
  }

  return (
    <div className="list-view-placeholder">
      <Button
        className={clsx({
          'is-ghost': true,
          'create-state-button': true,
          'is-loading': creatingState
        })}
        attr={{ onClick: createState, disabled: creatingState }}
      >
        <Icon icon={faPlus} attr={{ size: '10x' }} />
      </Button>
    </div>
  )
}

export default ListViewPlaceholder
