import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PrinterIcon } from "lucide-react"
import { Button } from "./ui/button"
import { LegacyRef, useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import Image from "next/image"
import { columns as Columns } from "./columns"

export default function PrintTable({ data, columns, target, date }: { data: any; columns: any; target?: string; date?: string }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: target,
  });

  const table = useReactTable({
    data,
    columns: Columns(columns),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  useEffect(() => {
    open && setTimeout(() => {
      reactToPrintFn();
      setOpen(false);
    }, 0)
  }, [open])

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className='bg-primary text-white p-4 rounded-md cursor-pointer'>
          <span>Imprimante</span>
          <PrinterIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-wheat min-w-[100vw]">
        <AlertDialogHeader>
          <AlertDialogTitle className="hidden"></AlertDialogTitle>
          <AlertDialogDescription className="hidden"></AlertDialogDescription>
        </AlertDialogHeader>
        {
          open && (
            <div className="overflow-x-auto max-w-full print:p-6" ref={contentRef as unknown as LegacyRef<HTMLTableElement>}>
              <div className="grid grid-cols-3 print:px-6">
                <Image src="/logo.png" alt="logo" width={100} height={100} />
                <h2
                  className="flex items-center justify-center text-4xl font-bold"
                >Fiche des {target}</h2>
                <h3
                  className="flex items-center justify-end text-2xl font-bold"
                >{date}</h3>
              </div>
              <Table className="w-full border-collapse">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup: any) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.slice(1).map((header: any) => (
                        <TableHead
                          key={header.id}
                          className="p-2 pt-0 hover:bg-muted print:bg-blue-500 print:text-muted print:pb-0 print:border print:text-center"
                        >
                          {
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
                <TableBody className="print:[&>*:nth-child(odd)]:bg-gray-100">
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row: any) => (
                      <TableRow
                        key={row.id}
                      >
                        {row.getVisibleCells().slice(1).map((cell: any) => (
                          <TableCell key={cell.id} className={`whitespace-nowrap px-2 print:border print:text-base`}>
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
                        colSpan={"columns".length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )
        }
      </AlertDialogContent>
    </AlertDialog>
  )
}
