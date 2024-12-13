import { Checkbox } from './ui/checkbox'
import { CheckedState } from '@radix-ui/react-checkbox'

const CheckboxPrix = ({ id, onCheckedChange, isChecked, disabled }: { id: string, onCheckedChange: (checked: CheckedState) => void, isChecked: boolean, disabled?: boolean, }) => {
  return (
    <Checkbox id={id} onCheckedChange={onCheckedChange} checked={isChecked} disabled={disabled} />
  )
}

export default CheckboxPrix