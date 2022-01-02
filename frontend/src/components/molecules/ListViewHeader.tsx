import React, { useState } from 'react'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { State } from 'types/state'
import InputField from './InputField'
import Button from 'components/atoms/Button'
import './ListViewHeader.scoped.css'

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
