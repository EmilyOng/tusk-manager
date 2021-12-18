import React, { useState } from 'react'
import { default as DatePicker_ } from 'react-datepicker'

type Props = {
  events: {
    onChange: (date: Date) => void
  }
}

const DatePicker: React.FC<Props> = ({ events }) => {
  const [date, setDate] = useState<Date | null>(null)

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
