import React from 'react'

type Props = {
  name: string
  value: string
  label: string
  required?: boolean
  placeholder?: string
  events?: {
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => any
  }
}

const TextArea: React.FC<Props> = ({
  name,
  value,
  label,
  required = true,
  placeholder,
  events
}) => {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <textarea
        className="textarea is-info"
        name={name}
        placeholder={placeholder}
        value={value}
        required={required}
        {...events}
      />
    </div>
  )
}

export default TextArea
