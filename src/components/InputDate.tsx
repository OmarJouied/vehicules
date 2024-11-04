import React, { ChangeEventHandler } from 'react'
import { Input } from './ui/input'

const InputDate = ({ id, onChange, placeholder, value, errorCondition }: { id: string; value: string; placeholder: string; onChange: ChangeEventHandler<HTMLInputElement>; errorCondition: Boolean }) => {
  return (
    <Input
      id={id}
      className={`col-span-3 ${errorCondition && "focus-visible:ring-danger"}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  )
}

export default InputDate