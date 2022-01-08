import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { faEdit, faTimes, faRedo } from '@fortawesome/free-solid-svg-icons'
import { useTags } from 'composables/tag'
import LoadingBar from 'components/molecules/LoadingBar'
import InputField from 'components/molecules/InputField'
import Button from 'components/atoms/Button'
import DropdownColor from 'components/molecules/DropdownColor'
import { TagAPI } from 'api/tag'
import './FormTagsManage.scoped.css'
import { BoardPrimitive, TagPrimitive } from 'generated/models'
import { Color } from 'generated/types'

type Props = {
  board: BoardPrimitive
  events: {
    onSubmit: () => any
  }
}

interface DeletableTag extends TagPrimitive {
  deleted: boolean
}

const FormTagsManage: React.FC<Props> = ({ board, events }) => {
  const { loading, tags: tags_ } = useTags(board.id)
  const [tags, setTags] = useState<DeletableTag[]>([])
  const [submitting, setSubmitting] = useState(false)
  const tagsAPI = new TagAPI()

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

  function onSubmit_(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    Promise.all(
      tags.map((tag) =>
        tag.deleted
          ? tagsAPI.deleteTag({ id: tag.id })
          : tagsAPI.editTag({ ...tag, boardId: board.id })
      )
    ).finally(() => {
      setSubmitting(false)
      events.onSubmit()
    })
  }

  function onToggleDeleteTag(tagId: number) {
    setTags(
      tags.map((tag) =>
        tag.id === tagId ? { ...tag, deleted: !tag.deleted } : tag
      )
    )
  }

  return loading ? (
    <LoadingBar />
  ) : (
    <form className="control" onSubmit={onSubmit_}>
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
              events={{ onChange: onInputChange }}
            />
            <DropdownColor
              initialColor={tag.color}
              events={{ onSelect: (key) => (tag.color = key as Color) }}
            />
            <Button
              className="is-danger is-inverted"
              icon={tag.deleted ? faRedo : faTimes}
              events={{ onClick: () => onToggleDeleteTag(tag.id) }}
            />
          </div>
        ))}
      </div>
      <div className="control form-control">
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

export default FormTagsManage
