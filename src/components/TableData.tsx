"use client"

import { LegacyRef, useCallback, useContext, useEffect, useRef, useState } from "react"
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
import { ArrowDown, ArrowUp, ChevronDown, PrinterIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import DeleteItems from "./DeleteItems"
import { getIds, jsonToPdf, recalcule, toXlsx } from "@/utils/frontend-functions"
import EditData from "./EditData"
import { Label } from "./ui/label"
import PageResize from "./PageResize"
import ImportExcel from "./ImportExcel"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { context } from "@/containers/MainContent"
import { useSearchParams } from "next/navigation"

function useSkipper() {
  const shouldSkipRef = useRef(true)
  const shouldSkip = shouldSkipRef.current

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false
  }, [])

  useEffect(() => {
    shouldSkipRef.current = true
  })

  return [shouldSkip, skip] as const
}

export function TableData({ columns, data, title }: { columns: ColumnDef<VehiculeType>[]; data: VehiculeType[]; title: string }) {
  const search = useSearchParams();
  const { setCurrentData } = useContext(context) as any;
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const tableRef = useRef<HTMLTableElement>();
  const [selected, setSelected] = useState<"Page" | "Tous" | "Choisi">("Page");
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

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
    autoResetPageIndex,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex
      }
    },
    meta: {
      updateData: (calculate: any[]) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex()
        setCurrentData((prev: any[]) => prev.map((p, idx) => ({ ...p, total: calculate[idx] ?? p.total })));
      },
    },
    debugTable: true,
  })
  const [size, setSize] = useState(table.initialState.pagination.pageSize)

  const exportXlsx = () => {
    toXlsx(title,
      table.getFilteredSelectedRowModel().rows.length > 0 ?
        table.getSelectedRowModel().rows.map(row => Object.fromEntries(row.getVisibleCells().slice(1).map(cell => [cell.column.id, cell.getValue()])))
        :
        table.getRowModel().rows.map(row => Object.fromEntries(row.getVisibleCells().slice(1).map(cell => [cell.column.id, cell.getValue()]))))
  }

  const printTable = () => {
    const headers = table.getHeaderGroups()?.[0].headers.slice(1).map(head => head.id);
    const du = search.get('du');
    const au = search.get('au');
    const dates = (du && au ? [du, au].join(' ... ') : du ?? au) ?? ""
    jsonToPdf(
      `Fiche des ${title}`,
      table.getFilteredSelectedRowModel().rows.length > 0 ?
        table.getSelectedRowModel().rows.map(row => [...row.getVisibleCells().slice(1).map(cell => cell.getValue()), ...Array(headers.length - row.getVisibleCells().slice(1).map(cell => cell.getValue()).length).fill(0)]) : table.getRowModel().rows.map(row => [...row.getVisibleCells().slice(1).map(cell => cell.getValue()), ...Array(headers.length - row.getVisibleCells().slice(1).map(cell => cell.getValue()).length).fill(0)]),
      [headers],
      dates
    );
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

  useEffect(() => {
    if (title === 'analytics') {
      const calculate = recalcule(table, [
        "assurance",
        "carnet_metrologe",
        "onssa",
        "taxe_tenage",
        "val_carburant",
        "val_carburant_ttc",
        "val_carburant_ext",
        "val_carburant_ext_ttc",
        "val_lub",
        "val_lub_ttc",
        "vignte",
        "visite_technique",
      ]);
      (table.options.meta as any)?.updateData(calculate);
    }
  }, [table.getAllColumns().filter(col => col.getIsVisible()).length, table, title])

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center py-4 justify-between gap-4">
        <div className="flex flex-wrap gap-4 items-center">
          {title === "vidange" && (
            <>
              <Label className="flex flex-col gap-2">
                <span>vidange</span>
                <RadioGroup defaultValue="" onValueChange={
                  (value) =>
                    table.getColumn("vidange_changer")?.setFilterValue(value)
                }
                >
                  <Label className="flex capitalize cursor-pointer items-center gap-2">
                    <RadioGroupItem value="" />
                    <span>tous</span>
                  </Label>
                  <Label className="flex capitalize cursor-pointer items-center gap-2">
                    <RadioGroupItem value="oui" />
                    <span>Oui</span>
                  </Label>
                  <Label className="flex capitalize cursor-pointer items-center gap-2">
                    <RadioGroupItem value="no" />
                    <span>No</span>
                  </Label>
                </RadioGroup>
              </Label>
              <Label className="flex flex-col gap-2">
                <span>filter</span>
                <RadioGroup defaultValue="" onValueChange={
                  (value) =>
                    table.getColumn("filter_changer")?.setFilterValue(value)
                }
                >
                  <Label className="flex capitalize cursor-pointer items-center gap-2">
                    <RadioGroupItem value="" />
                    <span>tous</span>
                  </Label>
                  <Label className="flex capitalize cursor-pointer items-center gap-2">
                    <RadioGroupItem value="oui" />
                    <span>Oui</span>
                  </Label>
                  <Label className="flex capitalize cursor-pointer items-center gap-2">
                    <RadioGroupItem value="no" />
                    <span>No</span>
                  </Label>
                </RadioGroup>
              </Label>
            </>
          )}
        </div>
        <div className="flex flex-wrap justify-end items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="hover:bg-primary/80">
                Plus <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-96 w-fit p-2.5 overflow-auto" align="end">
              <div className="flex flex-col gap-2.5">
                <ImportExcel fields={columns.slice(1).map((col: any) => col.accessorKey)} target={title} />
                <Button className='bg-primary text-white p-4 rounded-md cursor-pointer' onClick={exportXlsx}>
                  exporter excel
                </Button>
                <Button onClick={printTable} className='bg-primary text-white p-4 rounded-md cursor-pointer'>
                  <span>Imprimante</span>
                  <PrinterIcon />
                </Button>
                {table.getFilteredSelectedRowModel().rows.length > 0 && !["vidange", "analytics"].includes(title) && <DeleteItems ids={getIds(table as any)} target={title} table={table} />}
                {table.getFilteredSelectedRowModel().rows.length > 0 && !["vidange", "analytics"].includes(title) && (
                  <EditData fields={columns.slice(1).map((col: any) => col.accessorKey)} data={table.getSelectedRowModel().rows.map(row => row.original)} target={title} table={table} />
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="hover:bg-primary/80">
                Lignes <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-96 overflow-auto" align="end">
              <div className="flex flex-col gap-2.5 p-1.5">
                <Button className={`${selected === "Page" ? 'text-primary-foreground bg-primary' : 'bg-transparent text-primary hover:bg-primary/40'} flex items-center cursor-pointer`} onClick={() => handleChosePrint("Page")}>
                  <span className='p-2 rounded-md w-14 text-center'>Page</span>
                </Button>
                <Button className={`${selected === "Tous" ? 'text-primary-foreground bg-primary' : 'bg-transparent text-primary hover:bg-primary/40'} flex items-center cursor-pointer`} onClick={() => handleChosePrint("Tous")}>
                  <span className='p-2 rounded-md w-14 text-center'>Tous</span>
                </Button>
                <Button className={`${selected === "Choisi" ? 'text-primary-foreground bg-primary' : 'bg-transparent text-primary hover:bg-primary/40'} flex items-center cursor-pointer`} onClick={() => handleChosePrint("Choisi")}>
                  <span className='p-2 rounded-md w-14 text-center'>Choisi</span>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
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
                  <TableHead
                    key={header.id}
                    {...(header.column.getCanSort() ? { className: "p-2 pt-0" } : { className: "!pr-2" })}
                  >
                    {header.column.getCanSort() ? <>
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        className={header.column.getCanSort()
                          ? 'cursor-pointer select-none px-2 py-2 text-center hover:bg-muted'
                          : ''}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === 'asc'
                              ? 'Sort ascending'
                              : header.column.getNextSortingOrder() === 'desc'
                                ? 'Sort descending'
                                : 'Clear sort'
                            : undefined
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </div>
                      <div className="relative flex items-center rounded-md bg-background">
                        <Input
                          value={(table.getColumn(header.column.id)?.getFilterValue() as string) ?? ""}
                          onChange={(event) => {
                            table.getColumn(header.column.id)?.setFilterValue(event.target.value)
                          }
                          }
                          className="px-0 border-l-4 border-r-0 border-transparent focus-visible:ring-transparent focus-visible:ring-offset-0"
                        />
                        <SearchIcon
                          className="mx-1 max-w-3 max-h-3"
                        />
                      </div>

                    </>
                      :
                      header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                    }
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
                      <TableCell key={cell.id} className={`whitespace-nowrap ${cell.column.id !== "select" && "px-2"}`}>
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
                    <TableCell key={cell.id} className={`whitespace-nowrap ${cell.column.id !== "select" && "px-2"}`}>
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
            onClick={() => { setPageIndex(table.getState().pagination.pageIndex); table.previousPage() }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setPageIndex(table.getState().pagination.pageIndex); table.nextPage() }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
