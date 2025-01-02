import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Check, ChevronDown } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

const ColumnVisible = ({ table }: { table: Table<any> }) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="hover:bg-primary/80">
          Colonnes <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-96 overflow-auto" align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <Label key={column.id} className='relative capitalize font-normal flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-foreground/5'>
              <Checkbox className='hidden' checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)} />
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <div className="h-3.5 w-3.5 rounded">
                  {column.getIsVisible() && <Check className="h-4 w-4" />}
                </div>
              </span>
              {column.id}
            </Label>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ColumnVisible