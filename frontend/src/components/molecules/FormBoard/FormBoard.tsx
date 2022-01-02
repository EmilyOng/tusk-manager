import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { Color } from 'types/common'
import Button from 'components/atoms/Button'
import InputField from '../InputField'
import DropdownColor from '../DropdownColor'
import './FormBoard.scoped.css'

export type Form = {
  id?: number
  name: string
  color: Color
}

type Props = {
  initial?: Form
  actionLabels: {
    ok: string
  }
  events: {
    onSubmit: (form: Form, cb: () => void) => any
    onCancel: () => any
  }
}

const FormBoard: React.FC<Props> = ({ initial, actionLabels, events }) => {
  const defaultForm = initial || {
    name: '',
    color: Color.Turquoise
  }
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<Form>(defaultForm)

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
      <div className="form-fields">
        <div className="name-field field">
          <InputField
            name="name"
            label="Name"
            type="text"
            icon={faEdit}
            value={form.name}
            events={{ onChange: onInputChange }}
          />
        </div>
        <div className="color-field field">
          <label className="label">Color</label>
          <DropdownColor
            initialColor={initial?.color}
            events={{
              onSelect: (key) => setForm({ ...form, color: key as Color })
            }}
          />
        </div>
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
          label={actionLabels.ok}
        />
      </div>
    </form>
  )
}

export default FormBoard
