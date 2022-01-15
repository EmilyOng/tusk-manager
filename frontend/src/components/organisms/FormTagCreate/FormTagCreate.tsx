import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Color } from 'generated/types'
import Button from 'components/atoms/Button'
import DropdownColor from 'components/molecules/DropdownColor'
import InputField from 'components/molecules/InputField'
import './FormTagCreate.scoped.css'

export type Form = {
  name: string
  color: Color
}

type Props = {
  events: {
    onSubmit: (form: Form, cb: () => void) => any
  }
}

const FormTagCreate: React.FC<Props> = ({ events }) => {
  const [submitting, setSubmitting] = useState(false)
  const defaultForm: Form = { name: '', color: Color.Cyan }
  const [tag, setTag] = useState(defaultForm)

  useEffect(() => {
    return () => {
      // Clean-up
      setSubmitting(false)
      setTag(defaultForm)
    }
  }, [])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    events.onSubmit(tag, () => {
      setSubmitting(false)
      setTag(defaultForm)
    })
  }

  function onTagNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTag({ ...tag, name: e.target.value })
  }

  return (
    <form className="control" onSubmit={onSubmit}>
      <p className="has-text-weight-bold">Create tag</p>
      <div className="tag-container">
        <div className="tag-name-field">
          <InputField
            name="name"
            type="text"
            label=""
            value={tag.name}
            events={{ onChange: onTagNameChange }}
          />
        </div>
        <div className="tag-actions">
          <DropdownColor
            initialColor={tag.color}
            events={{
              onSelect: (key) => setTag({ ...tag, color: key as Color })
            }}
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
      </div>
    </form>
  )
}

export default FormTagCreate
