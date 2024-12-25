import React, { useContext, useState } from 'react'
import { Button } from './ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table'
import { VehiculeType } from '@/models/Vehicule'
import DeleteItems from './DeleteItems'
import { getIds, simplify } from '@/utils/frontend-functions'
import EditData from './EditData'
import ResponseType from '@/types/ResponseType'
import { useToast } from '@/hooks/use-toast'
import { context } from '@/containers/MainContent'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'

const ImportData = ({ data, columns, target }: { data: any[]; columns: ColumnDef<VehiculeType>[]; target: string }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [currentData, setCurrentData] = useState(data)
  const [open, setOpen] = useState(true);
  const table = useReactTable({
    data: currentData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId: row => row.uuid,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: data.length
      }
    }
  })

  const { setCurrentData: setMainData } = useContext(context) as any;

  const { toast } = useToast();

  const deleteAction = () => {
    table.getRowModel().rows.forEach(row => row.toggleSelected(false));
    setCurrentData(prev => [...prev.filter((_, idx) => !table.getSelectedRowModel().rows.map(row => +row.id).includes(idx))]);
  }

  const editAction = (data: any) => {
    setCurrentData(prev => {
      const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
      const indexes = selectedRows.map(selectedRow => prev.findIndex(pr => JSON.stringify(pr) === JSON.stringify(selectedRow)))
      let tmp = [...prev], i = 0;
      for (const idx of indexes) {
        tmp = [...tmp.slice(0, idx), data[i++], ...tmp.slice(idx + 1)];
      }
      return tmp;
    })
  }

  const save = async () => {
    const res = await fetch(`/api/${target}`, {
      method: "POST",
      body: JSON.stringify(
        target === "deplacements" ?
          currentData.map(row => simplify(Object.fromEntries(Object.entries(row).filter(item => columns.slice(1).map((item: any) => item.accessorKey).includes(item[0])))))
          :
          currentData.map(item => simplify(item))
      )
    });
    const { message, refData }: ResponseType & { refData: any } = await res.json();

    if (!res.ok) {
      toast({
        title: "Erreur des donnees.",
        description: message,
        variant: "destructive"
      })
    } else {
      toast({
        title: message,
        className: 'bg-success'
      })
      const sortedRefData = refData.sort((a: any, b: any) => {
        if (a.matricule > b.matricule) return 1;
        if (a.matricule < b.matricule) return -1;
        return 0;
      })
      const sortedCurrentData = currentData.sort((a: any, b: any) => {
        if (a.matricule > b.matricule) return 1;
        if (a.matricule < b.matricule) return -1;
        return 0;
      })

      setMainData((prev: any) => [...sortedCurrentData.map((sortedItem, idx) => ({ ...sortedItem, ...sortedRefData[idx] })), ...prev].sort(target === "vehicules" ? (a: any, b: any) => {
        if (a.matricule > b.matricule) return 1;
        if (a.matricule < b.matricule) return -1;
        return 0;
      } : undefined));
      setOpen(false);
    }
  }

  const cancel = () => { setOpen(false) }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='bg-wheat w-[calc(100%-2rem)] flex max-h-[calc(100vh_-_2rem)]'>
        <DialogTitle className='hidden'></DialogTitle>
        <div className='flex flex-col gap-2.5 w-full max-w-full mt-4'>
          <div className="flex gap-1.5 justify-end">
            {table.getFilteredSelectedRowModel().rows.length > 0 && <DeleteItems ids={getIds(table)} deleteAction={deleteAction} table={table} />}
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <EditData
                fields={columns.slice(1).map((col: any) => col.accessorKey)}
                data={table.getSelectedRowModel().rows.map(row => row.original)}
                editAction={editAction}
                table={table}
                target={target}
              />
            )}
          </div>
          <Table>
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
                table.getRowModel().rows.map((row) => (
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
          <div className="flex justify-between gap-1.5">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex gap-1.5 justify-end">
              <Button type="submit" onClick={cancel}>Decharge</Button>
              <Button type="submit" onClick={save}>Enregistrer</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImportData