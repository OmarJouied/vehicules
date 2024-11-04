"use client"

import { LegacyRef, useRef, useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { VehiculeType } from "@/models/Vehicule"
import DeleteVehicules from "./DeleteVehicules"
import { getMarticules } from "@/utils/frontend-functions"
import Printer from "./Printer"
import { utils, writeFileXLSX } from "xlsx"
import EditVehicules from "./EditVehicules"
import { Label } from "./ui/label"
import PageResize from "./PageResize"

export function TableData({ columns, data }: { columns: ColumnDef<VehiculeType>[]; data: VehiculeType[] }) {
  const [sorting, setSorting] = useState<SortingState>([{
    id: 'matricule',
    desc: false,
  }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const tableRef = useRef();
  const [selected, setSelected] = useState<"Page" | "Tous" | "Choisi">("Page");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 5
      }
    }
  })
  const [size, setSize] = useState(table.initialState.pagination.pageSize)

  const toXlsx = () => {
    const wb = utils.table_to_book(tableRef.current, { origin: "01" });
    writeFileXLSX(wb, "table.xlsx");
  }

  const handleChosePrint = (type: "Page" | "Tous" | "Choisi") => {
    setSelected(type);

    switch (type) {
      case "Page":
        table.setPageSize(size);
        break;

      default:
        table.setPageSize(data.length);
        break;
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between gap-4">
        <Input
          placeholder="Recherche matricules..."
          value={(table.getColumn("matricule")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("matricule")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          {table.getFilteredSelectedRowModel().rows.length > 0 && <DeleteVehicules matricules={getMarticules(table)} />}
          {table.getFilteredSelectedRowModel().rows.length > 0 && <EditVehicules vehicules={table.getSelectedRowModel().rows.map(row => row.original)} />}
          <button className="bg-primary text-white p-2 px-3 rounded-md cursor-pointer" onClick={toXlsx}>xl</button>
          <Printer contentRef={tableRef as any} table={table}>
            <form defaultValue="option-one" className='flex justify-between gap-2.5'>
              <Label className='flex items-center space-x-2 cursor-pointer'>
                <input className="peer hidden" type="radio" value="page" checked={selected === "Page"} onChange={() => handleChosePrint("Page")} />
                <span className="peer-checked:text-primary-foreground peer-checked:bg-primary p-2 rounded-md">Page</span>
              </Label>
              <Label className='flex items-center space-x-2 cursor-pointer'>
                <input className="peer hidden" type="radio" value="tous" checked={selected === "Tous"} onChange={() => handleChosePrint("Tous")} />
                <span className="peer-checked:text-primary-foreground peer-checked:bg-primary p-2 rounded-md">Tous</span>
              </Label>
              <Label className='flex items-center space-x-2 cursor-pointer'>
                <input className="peer hidden" type="radio" value="choisi" checked={selected === "Choisi"} onChange={() => handleChosePrint("Choisi")} />
                <span className="peer-checked:text-primary-foreground peer-checked:bg-primary p-2 rounded-md">Choisi</span>
              </Label>
            </form>
          </Printer>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="hover:bg-primary/80">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent id="omar" className="max-h-96 overflow-auto" align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border border-primary">
        <Table ref={tableRef as unknown as LegacyRef<HTMLTableElement>}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => selected === "Choisi" ? (
                row.getIsSelected() && (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              ) : (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-2.5 py-4 flex-wrap-reverse">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex gap-2">
          <Label className="flex gap-1 items-center h-9">
            <span>N. Lignes</span>
            <PageResize size={size} setSize={setSize} table={table} />
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
