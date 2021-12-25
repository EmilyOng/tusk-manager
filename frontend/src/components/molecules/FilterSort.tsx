import React, { Key } from 'react'
import Dropdown from './DropdownSelect'

export enum TaskSortBy {
  CreatedAt = 'CreatedAt',
  Name = 'Name',
  DueDate = 'DueDate'
}

export const TaskSort = [
  {
    id: TaskSortBy.CreatedAt,
    name: 'Created at'
  },
  {
    id: TaskSortBy.Name,
    name: 'Name'
  },
  {
    id: TaskSortBy.DueDate,
    name: 'Due Date'
  }
]

type Props = {
  events: {
    onFilterSort: (sortBy: TaskSortBy) => any
  }
}

const FilterSort: React.FC<Props> = ({ events }) => {
  const sortItems = TaskSort.map((sort) => {
    return <div key={sort.id}>{sort.name}</div>
  })

  function onFilterSort(key: Key | null) {
    if (!key) {
      return
    }
    events.onFilterSort(key as TaskSortBy)
  }

  return (
    <Dropdown
      initial={TaskSortBy.CreatedAt}
      items={sortItems}
      events={{ onSelect: onFilterSort }}
    />
  )
}

export default FilterSort
