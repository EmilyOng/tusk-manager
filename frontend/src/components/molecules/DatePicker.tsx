import React, { useState } from 'react'
import { default as DatePicker_ } from 'react-datepicker'

type Props = {
  date?: Date
  events: {
    onChange: (date: Date) => void
  }
}

const DatePicker: React.FC<Props> = ({ date: _date, events }) => {
  const [date, setDate] = useState<Date | null>(_date || null)

  function onChange(date: Date) {
    setDate(date)
    events.onChange(date)
  }

  return (
    <DatePicker_
      className="input is-info"
      selected={date}
      onChange={onChange}
    />
  )
}

export default DatePicker
