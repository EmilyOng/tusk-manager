import React, { useState } from 'react'
import clsx from 'clsx'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { TagPrimitive } from 'types/tag'
import DropdownItem from './DropdownItem'
import Icon from 'components/atoms/Icon'
import Tag, { TagAction } from 'components/atoms/Tag'
import './TagsSelect.css'

type Props = {
  tags: TagPrimitive[]
  events: {
    onSelect: (tag: TagPrimitive) => any
  }
}

interface SelectableTag extends TagPrimitive {
  selected: boolean
}

const TagsSelect: React.FC<Props> = ({ tags, events }) => {
  const [active, setActive] = useState(false)
  const [selectableTags, setSelectableTags] = useState<SelectableTag[]>(
    tags.map((tag) => {
      return { ...tag, selected: false }
    })
  )

  function clickDropdown(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
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

  return (
    <div
      className={clsx({
        dropdown: true,
        'is-active': active
      })}
    >
      <div className="dropdown-trigger">
        <div
          className="tags-select input"
          aria-haspopup={true}
          aria-controls="dropdown-menu"
          onClick={clickDropdown}
        >
          <div className="tags-container">
            {selectableTags.reduce((acc, tag) => {
              if (tag.selected) {
                acc.push(
                  <Tag
                    key={tag.id}
                    className="selected-tag"
                    name={tag.name}
                    color={tag.color}
                    action={{
                      type: TagAction.Delete,
                      onAction: () => onSelect(tag.id)
                    }}
                  />
                )
              }
              return acc
            }, [] as JSX.Element[])}
          </div>
          <span className="dropdown-icon">
            <Icon icon={faAngleDown} />
          </span>
        </div>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {selectableTags.reduce(
            (acc, tag) => {
              if (!tag.selected) {
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
              <div key={-1} className="no-matches-found">
                No matches found
              </div>
            ] as JSX.Element[]
          )}
        </div>
      </div>
    </div>
  )
}

export default TagsSelect
