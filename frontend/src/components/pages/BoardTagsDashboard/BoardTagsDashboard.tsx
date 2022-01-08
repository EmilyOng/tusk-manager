import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { faEdit, faTimes, faRedo } from '@fortawesome/free-solid-svg-icons'
import { useTags } from 'composables/tag'
import LoadingBar from 'components/molecules/LoadingBar'
import InputField from 'components/molecules/InputField'
import Button from 'components/atoms/Button'
import DropdownColor from 'components/molecules/DropdownColor'
import { TagAPI } from 'api/tag'
import './BoardTagsDashboard.scoped.css'
import { TagPrimitive } from 'generated/models'
import { Color } from 'generated/types'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectBoards } from 'store/boards'

interface DeletableTag extends TagPrimitive {
  deleted: boolean
}

function BoardTagsDashboard() {
  const navigate = useNavigate()
  const { currentBoardId: boardId } = useSelector(selectBoards)
  const { loading, tags: tags_ } = useTags(boardId)
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
          : tagsAPI.editTag({ ...tag, boardId: boardId! })
      )
    ).finally(() => {
      setSubmitting(false)
      navigate(`/${boardId}`)
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
    <div className="board-tags-dashboard box">
      <div className="board-tags-header">
        <h2 className="subtitle">Manage Tags</h2>
      </div>
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
            type="button"
            className="is-light"
            label="Cancel"
            events={{ onClick: () => navigate(`/${boardId}`) }}
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
    </div>
  )
}

export default BoardTagsDashboard