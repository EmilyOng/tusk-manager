import { faPen } from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'
import React, { createRef, useEffect, useState } from 'react'
import { StatePrimitive } from 'generated/models'
import Button from 'components/atoms/Button'
import InputField from '../InputField'
import './ListViewHeader.scoped.css'

type Props = {
  canEdit: boolean
  state: StatePrimitive
  events: {
    onEditState: (newState: StatePrimitive, cb: () => void) => void
  }
}

const ListViewHeader: React.FC<Props> = ({ canEdit, state, events }) => {
  const [editingStateName, setEditingStateName] = useState(false)
  const [submittingStateName, setSubmittingStateName] = useState(false)
  const [stateName, setStateName] = useState(state.name)
  const inputRef = createRef<HTMLInputElement>()

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setStateName(value)
  }

  function onEditState() {
    setEditingStateName(false)
    if (stateName === state.name) {
      return
    }
    setSubmittingStateName(true)
    events.onEditState(
      {
        ...state,
        name: stateName
      },
      () => setSubmittingStateName(false)
    )
  }

  useEffect(() => {
    if (!editingStateName || !inputRef.current) {
      return
    }
    inputRef.current.focus()
  }, [editingStateName])

  return editingStateName ? (
    <InputField
      ref={inputRef}
      name="stateName"
      value={stateName}
      label=""
      type="text"
      events={{ onChange: onInputChange, onBlur: onEditState }}
    />
  ) : (
    <div className="list-view-wrap">
      <span className="list-view-title">{state.name}</span>
      {canEdit && (
        <Button
          className={clsx({
            'is-ghost': true,
            'is-loading': submittingStateName
          })}
          icon={faPen}
          events={{ onClick: () => setEditingStateName(true) }}
        />
      )}
    </div>
  )
}

export default ListViewHeader
