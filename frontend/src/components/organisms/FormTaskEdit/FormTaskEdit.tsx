import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import Button from 'components/atoms/Button'
import InputField from 'components/molecules/InputField'
import DropdownSelect from 'components/molecules/DropdownSelect'
import DatePicker from 'components/molecules/DatePicker'
import TagsSelect from 'components/molecules/TagsSelect'
import TextArea from 'components/molecules/TextArea'
import './FormTaskEdit.scoped.css'
import { StatePrimitive, TagPrimitive, Task } from 'generated/models'
import { Color } from 'generated/types'

export type Form = {
  id: number
  name: string
  description: string
  dueAt?: Date
  stateId: number
  tags: TagPrimitive[]
}

type Props = {
  task: Task
  tags: TagPrimitive[]
  states: StatePrimitive[]
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
      cb: (tag: TagPrimitive) => void
    }) => any
  }
}

const FormTaskEdit: React.FC<Props> = ({ task, states, tags, events }) => {
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<Form>({ ...task, stateId: task.stateId! })

  const stateItems = states.map((state) => (
    <div key={state.id}>{state.name}</div>
  ))

  useEffect(() => {
    return () => {
      // Clean-up
      setSubmitting(false)
      setForm({ ...task, stateId: task.stateId! })
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

  function updateTags(tag: TagPrimitive) {
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
          date={form.dueAt ? new Date(form.dueAt) : undefined}
          events={{
            onChange: (dueAt: Date) => setForm({ ...form, dueAt })
          }}
        />
      </div>
      <div className="field">
        <label className="label">Tags</label>
        <TagsSelect
          tags={tags.map((t) => {
            return { ...t, selected: form.tags.map((t) => t.id).includes(t.id) }
          })}
          events={{
            onSelect: (tag: TagPrimitive) => updateTags(tag),
            onCreateTag: events.onCreateTag
          }}
        />
      </div>
      <div className="field">
        <label className="label">State</label>
        <DropdownSelect
          initial={form.stateId.toString()}
          items={stateItems}
          events={{
            onSelect: (key) =>
              setForm({ ...form, stateId: parseInt(key as string) })
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
          label="Save Changes"
        />
      </div>
    </form>
  )
}

export default FormTaskEdit
