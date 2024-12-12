import React, { ChangeEventHandler } from 'react'
import { Input } from './ui/input'

const InputDate = ({ id, onChange, placeholder, value, errorCondition, disabled }: { id: string; value: string; placeholder: string; onChange: ChangeEventHandler<HTMLInputElement>; errorCondition: Boolean; disabled?: boolean }) => {
  return (
    <Input
      id={id}
      className={`flex-1 ${errorCondition && "focus-visible:ring-danger"}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  )
}

export default InputDate