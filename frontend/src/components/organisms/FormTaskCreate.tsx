import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { faEdit, faFile } from '@fortawesome/free-solid-svg-icons'
import { derivedState, State } from 'types/task'
import Button from '../atoms/Button'
import InputField from '../molecules/InputField'
import Dropdown from '../molecules/Dropdown'
import DatePicker from 'components/molecules/DatePicker'
import './FormBoardCreate.css'

export type Form = {
  name: string
  description: string
  dueAt?: Date | undefined
  state: State
}

type Props = {
  state: State
  events: {
    onSubmit: (form: Form, cb: () => void) => any
    onCancel: () => any
  }
}

const FormTaskCreate: React.FC<Props> = ({ state, events }) => {
  const defaultForm = {
    name: '',
    description: '',
    dueAt: undefined,
    state: State.Unstarted
  }
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<Form>(defaultForm)

  const states = [State.Unstarted, State.InProgress, State.Completed]
  states.sort((a, b) => (a === state ? -1 : b === state ? 1 : 0))
  const stateItems = states.map((state) => (
    <div key={state}>{derivedState(state)}</div>
  ))

  useEffect(() => {
    return () => {
      // Clean-up
      setSubmitting(false)
      setForm(defaultForm)
    }
  }, [])

  function onSubmit_(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    events.onSubmit(form, () => setSubmitting(false))
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value
    })
  }
  return (
    <form className="control" onSubmit={onSubmit_}>
      <InputField
        name="name"
        label="Name"
        type="text"
        icon={faEdit}
        value={form.name}
        events={{ onChange: onInputChange }}
      />
      <InputField
        name="description"
        label="Description"
        type="text"
        icon={faFile}
        required={false}
        value={form.description}
        events={{ onChange: onInputChange }}
      />
      <div className="due-date-field field">
        <label className="label">Due Date</label>
        <DatePicker
          events={{ onChange: (dueAt: Date) => setForm({ ...form, dueAt }) }}
        />
      </div>
      <div className="state-field field">
        <label className="label">State</label>
        <Dropdown
          items={stateItems}
          events={{
            onSelect: (key) => setForm({ ...form, state: key as State })
          }}
        />
      </div>
      <div className="control form-control">
        <Button
          type="button"
          className="is-light"
          label="Cancel"
          events={{ onClick: events.onCancel }}
        />
        <Button
          type="submit"
          className={clsx({
            'is-link': true,
            'is-loading': submitting
          })}
          attr={{ disabled: submitting }}
          label="Create"
        />
      </div>
    </form>
  )
}

export default FormTaskCreate
