import React, { Key } from 'react'
import DropdownSelect from '../DropdownSelect'

export enum TaskSortBy {
  Name = 'Name',
  DueDate = 'DueDate'
}

export const TaskSort = [
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
    <DropdownSelect
      initial={TaskSortBy.Name}
      items={sortItems}
      events={{ onSelect: onFilterSort }}
    />
  )
}

export default FilterSort
