import React, { useState } from 'react'
import { State } from 'types/state'
import InputField from './InputField'

type Props = {
  state: State
  events: {
    onEditState: (newState: State) => void
  }
}

const ListViewHeader: React.FC<Props> = ({ state, events }) => {
  const [editingStateName, setEditingStateName] = useState(false)
  const [stateName, setStateName] = useState(state.name)

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setStateName(value)
  }

  function onEditState() {
    setEditingStateName(false)
    events.onEditState({
      ...state,
      name: stateName
    })
  }

  return editingStateName ? (
    <InputField
      name="stateName"
      value={stateName}
      label=""
      type="text"
      events={{ onChange: onInputChange, onBlur: onEditState }}
    />
  ) : (
    <div className="list-view-title" onClick={() => setEditingStateName(true)}>
      {state.name}
    </div>
  )
}

export default ListViewHeader
