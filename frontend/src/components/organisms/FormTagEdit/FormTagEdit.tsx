import { faEdit, faRedo, faTimes } from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { TagPrimitive } from 'generated/models'
import { Color } from 'generated/types'
import Button from 'components/atoms/Button'
import DropdownColor from 'components/molecules/DropdownColor'
import InputField from 'components/molecules/InputField'
import SquareColor from 'components/molecules/SquareColor'
import './FormTagEdit.scoped.css'

export interface DeletableTag extends TagPrimitive {
  deleted: boolean
}

type Props = {
  tags: TagPrimitive[]
  canEdit: boolean
  events: {
    onCancel: () => void
    onUpdateTags: (tags: DeletableTag[], cb: () => void) => any
  }
}

const FormTagEdit: React.FC<Props> = ({ tags: tags_, canEdit, events }) => {
  const [tags, setTags] = useState<DeletableTag[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setTags(
      tags_.map((tag) => {
        return { ...tag, deleted: false }
      })
    )
    return () => {
      setTags([])
    }
  }, [tags_])

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    const id = parseInt(name)
    setTags(tags.map((tag) => (tag.id === id ? { ...tag, name: value } : tag)))
  }

  function onUpdateTags(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    events.onUpdateTags(tags, () => setSubmitting(false))
  }

  function onToggleDeleteTag(tagId: number) {
    setTags(
      tags.map((tag) =>
        tag.id === tagId ? { ...tag, deleted: !tag.deleted } : tag
      )
    )
  }

  return (
    <form className="control" onSubmit={onUpdateTags}>
      <p className="has-text-weight-bold">Update tags</p>
      <div className="tags-container">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className={clsx({
              'tag-action-field': true,
              'is-grouped': true,
              'deleted-field': tag.deleted
            })}
          >
            <InputField
              name={tag.id.toString()}
              label=""
              type="text"
              icon={faEdit}
              value={tag.name}
              disabled={!canEdit}
              events={{ onChange: onInputChange }}
            />
            {canEdit ? (
              <DropdownColor
                initialColor={tag.color}
                events={{ onSelect: (key) => (tag.color = key as Color) }}
              />
            ) : (
              <div className="color-field">
                <SquareColor color={tag.color} />
                <span>{tag.color}</span>
              </div>
            )}
            {canEdit && (
              <Button
                className="is-danger is-inverted"
                icon={tag.deleted ? faRedo : faTimes}
                events={{ onClick: () => onToggleDeleteTag(tag.id) }}
              />
            )}
          </div>
        ))}
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
          attr={{ disabled: submitting || !canEdit }}
          label="Save Changes"
        />
      </div>
    </form>
  )
}

export default FormTagEdit
