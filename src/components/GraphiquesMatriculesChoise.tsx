import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

export function GraphiquesMatriculesChoise({ choises, values, onChange }: { choises: string[]; values: string[]; onChange: ({ target: { value } }: any) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex-1 justify-between px-3"
        >
          <span className="max-w-36 overflow-hidden text-ellipsis">{values.length ? values.join(", ") : `${choises.length} matricules...`}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Recherche une matricule..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {choises.map((choise: string) => (
                <CommandItem
                  key={choise}
                  value={choise}
                  onSelect={(currentValue) => {
                    onChange((prev: any) => ({
                      ...prev, matricules:
                        prev.matricules.includes(currentValue) ? prev.matricules.filter((p: string) => p !== currentValue) : [...prev.matricules, currentValue]
                    }));
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      values.includes(choise) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {choise}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
