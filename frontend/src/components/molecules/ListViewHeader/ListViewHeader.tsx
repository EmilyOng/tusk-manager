import { faPen } from '@fortawesome/free-solid-svg-icons'
import React, { createRef, useEffect, useState } from 'react'
import { StatePrimitive } from 'generated/models'
import Button from 'components/atoms/Button'
import InputField from '../InputField'
import './ListViewHeader.scoped.css'

type Props = {
  state: StatePrimitive
  events: {
    onEditState: (newState: StatePrimitive) => void
  }
}

const ListViewHeader: React.FC<Props> = ({ state, events }) => {
  const [editingStateName, setEditingStateName] = useState(false)
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
    events.onEditState({
      ...state,
      name: stateName
    })
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
      <Button
        className="is-ghost"
        icon={faPen}
        events={{ onClick: () => setEditingStateName(true) }}
      />
    </div>
  )
}

export default ListViewHeader
