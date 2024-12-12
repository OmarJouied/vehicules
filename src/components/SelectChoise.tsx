import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectChoise({ choises, label, value, onChange }: { label: string; choises: string[]; value: string; onChange: ({ target: { value } }: any) => void }) {
  return (
    <Select value={value} onValueChange={(choise) => onChange({ target: { value: choise } })}>
      <SelectTrigger className="flex-1 capitalize">
        <SelectValue placeholder={`Choisi un ${label}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {choises.map(choise => <SelectItem key={choise} className="capitalize" value={choise}>{choise}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
