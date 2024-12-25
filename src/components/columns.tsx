import { VehiculeType } from "@/models/Vehicule"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

export const columns: (value: string[]) => ColumnDef<VehiculeType>[] = (vehiculeColumns: string[]) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="print:hidden"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="print:hidden"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  ...vehiculeColumns.map(title => ({
    accessorKey: title,
    header: title.toUpperCase(),
    cell: ({ row }: { row: any }) => (
      <div className="">{row.getValue(title)}</div>
    ),
    filterFn: (row: any, id: any, value: any) => {
      return `${row.original[id] ?? ""}`.toLowerCase().includes(value.toLowerCase());
    },
  })),
]