import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { Tag } from 'types/tag'
import { Color } from 'types/common'
import { State } from 'types/state'
import Button from '../atoms/Button'
import InputField from '../molecules/InputField'
import DropdownSelect from '../molecules/DropdownSelect'
import DatePicker from 'components/molecules/DatePicker'
import TagsSelect from 'components/molecules/TagsSelect'
import TextArea from 'components/molecules/TextArea'

export type Form = {
  name: string
  description: string
  dueAt?: string
  stateId: number | null
  tags: Tag[]
}

type Props = {
  state: State
  tags: Tag[]
  states: State[]
  events: {
    onSubmit: (form: Form, cb: () => void) => any
    onCancel: () => any
    onCreateTag: ({
      name,
      color,
      cb
    }: {
      name: string
      color: Color
      cb: (tag: Tag) => void
    }) => any
  }
}

const FormTaskCreate: React.FC<Props> = ({ state, states, tags, events }) => {
  const defaultForm = {
    name: '',
    description: '',
    dueAt: undefined,
    stateId: state.id,
    tags: []
  }
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<Form>(defaultForm)

  const sortedStates = [...states]
  sortedStates.sort((a, b) =>
    a.id === state.id ? -1 : b.id === state.id ? 1 : 0
  )
  const stateItems = sortedStates.map((state) => (
    <div key={state.id}>{state.name}</div>
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

  function onInputChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value
    })
  }

  function updateTags(tag: Tag) {
    const existing = form.tags.find((t) => t.id === tag.id)
    if (existing) {
      setForm({
        ...form,
        // Remove the tag
        tags: form.tags.filter((t) => t.id !== tag.id)
      })
    } else {
      // Add the tag
      setForm({
        ...form,
        tags: [...form.tags, tag]
      })
    }
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
      <TextArea
        name="description"
        label="Description"
        required={false}
        value={form.description}
        events={{ onChange: onInputChange }}
      />
      <div className="field">
        <label className="label">Due Date</label>
        <DatePicker
          events={{
            onChange: (dueAt: Date) =>
              setForm({ ...form, dueAt: dueAt.toString() })
          }}
        />
      </div>
      <div className="field">
        <label className="label">Tags</label>
        <TagsSelect
          tags={tags.map((t) => {
            return { ...t, selected: false }
          })}
          events={{
            onSelect: (tag: Tag) => updateTags(tag),
            onCreateTag: events.onCreateTag
          }}
        />
      </div>
      <div className="field">
        <label className="label">State</label>
        <DropdownSelect
          items={stateItems}
          events={{
            onSelect: (key) => setForm({ ...form, stateId: key as number })
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
