import { faAngleDown, faTimes } from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'
import React, { createRef, useEffect, useState } from 'react'
import { TagPrimitive } from 'generated/models'
import { Color } from 'generated/types'
import { Colors } from 'utils/color'
import Button from 'components/atoms/Button'
import Icon from 'components/atoms/Icon'
import TagItem from 'components/atoms/TagItem'
import DropdownItem from '../DropdownItem'
import TagItemAddon from '../TagItemAddon'
import './TagsSelect.scoped.css'

type Props = {
  tags: SelectableTag[]
  events: {
    onSelect: (tag: TagPrimitive) => any
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

export interface SelectableTag extends TagPrimitive {
  selected: boolean
}

const TagsSelect: React.FC<Props> = ({ tags, events }) => {
  const [active, setActive] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const tagInputField = createRef<HTMLInputElement>()
  const [isCreatingTag, setIsCreatingTag] = useState(false)
  const [selectableTags, setSelectableTags] = useState<SelectableTag[]>([])

  useEffect(() => {
    setSelectableTags(tags)
  }, [])

  function clickDropdown(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    tagInputField.current?.focus()
    setActive(!active)
  }

  function onSelect(tagId: number) {
    setSelectableTags(
      selectableTags.map((tag) => {
        if (tag.id === tagId) {
          const newTag = { ...tag, selected: !tag.selected }
          events.onSelect(newTag)
          return newTag
        }
        return tag
      })
    )
  }

  function onCreateTag() {
    setIsCreatingTag(true)
    events.onCreateTag({
      name: tagInput,
      color: Colors[tagInput.length % Colors.length],
      cb: (tag: TagPrimitive) => {
        setIsCreatingTag(false)
        setTagInput('') // Reset search input
        setSelectableTags([...selectableTags, { ...tag, selected: true }])
        events.onSelect(tag)
      }
    })
  }

  function onTagInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTagInput(e.target.value)
    setActive(true) // Make sure the dropdown is active
  }

  function isMatchTagInput(tag: TagPrimitive) {
    return tag.name.toLowerCase().includes(tagInput.toLowerCase())
  }

  return (
    <div
      className={clsx({
        dropdown: true,
        'is-active': active
      })}
    >
      <div className="dropdown-trigger">
        <div
          className="tags-select input is-info"
          aria-haspopup={true}
          aria-controls="dropdown-menu"
          onClick={clickDropdown}
        >
          <div className="tags-container">
            {selectableTags.reduce((acc, tag) => {
              if (tag.selected) {
                acc.push(
                  <TagItem
                    key={tag.id}
                    className="selected-tag"
                    name={tag.name}
                    color={tag.color}
                  >
                    <TagItemAddon events={{ onClick: () => onSelect(tag.id) }}>
                      <Icon icon={faTimes} />
                    </TagItemAddon>
                  </TagItem>
                )
              }
              return acc
            }, [] as JSX.Element[])}
            <input
              type="text"
              className="tag-input"
              ref={tagInputField}
              value={tagInput}
              onChange={onTagInputChange}
            />
          </div>
          <span className="dropdown-icon">
            <Icon icon={faAngleDown} />
          </span>
        </div>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {tagInput.length > 0 &&
            selectableTags.filter((tag) => isMatchTagInput(tag)).length ===
              0 && (
              <span className="dropdown-item">
                <Button
                  className={clsx({
                    'create-new-tag': true,
                    'is-link': true,
                    'is-loading': isCreatingTag
                  })}
                  events={{ onClick: onCreateTag }}
                  attr={{ disabled: isCreatingTag }}
                >
                  Create a new tag:{' '}
                  <TagItem className="new-tag" name={tagInput} />
                </Button>
              </span>
            )}
          {selectableTags.reduce(
            (acc, tag) => {
              const match = tagInput.length <= 0 ? true : isMatchTagInput(tag)
              if (!tag.selected && match) {
                if (acc[0].key === '-1') {
                  acc = []
                }
                acc.push(
                  <DropdownItem key={tag.id} onSelect={() => onSelect(tag.id)}>
                    {tag.name}
                  </DropdownItem>
                )
              }
              return acc
            },
            [
              <div key={-1} className="no-matches-found dropdown-item">
                <span>No matches found</span>
              </div>
            ] as JSX.Element[]
          )}
        </div>
      </div>
    </div>
  )
}

export default TagsSelect
