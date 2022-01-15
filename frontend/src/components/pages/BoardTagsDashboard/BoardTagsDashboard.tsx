import { faEdit, faRedo, faTimes } from '@fortawesome/free-solid-svg-icons'
import { TagAPI } from 'api/tag'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { TagPrimitive } from 'generated/models'
import { Color } from 'generated/types'
import { selectBoards } from 'store/boards'
import { selectMeMember } from 'store/members'
import { canEdit } from 'utils/role'
import { useBoardTags } from 'composables/board'
import Button from 'components/atoms/Button'
import DropdownColor from 'components/molecules/DropdownColor'
import InputField from 'components/molecules/InputField'
import LoadingBar from 'components/molecules/LoadingBar'
import SquareColor from 'components/molecules/SquareColor'
import './BoardTagsDashboard.scoped.css'

interface DeletableTag extends TagPrimitive {
  deleted: boolean
}

function BoardTagsDashboard() {
  const navigate = useNavigate()
  const { currentBoardId: boardId } = useSelector(selectBoards)
  const { loading, tags: tags_ } = useBoardTags(boardId)
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

  const [meCanEdit, setMeCanEdit] = useState(false)
  const meMember = useSelector(selectMeMember)

  useEffect(() => {
    setMeCanEdit(canEdit(meMember?.role))
  }, [meMember])

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
                disabled={!meCanEdit}
                events={{ onChange: onInputChange }}
              />
              {meCanEdit ? (
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
              {meCanEdit && (
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
            events={{ onClick: () => navigate(`/${boardId}`) }}
          />
          <Button
            type="submit"
            className={clsx({
              'is-link': true,
              'is-loading': submitting
            })}
            attr={{ disabled: submitting || !meCanEdit }}
            label="Save Changes"
          />
        </div>
      </form>
    </div>
  )
}

export default BoardTagsDashboard
