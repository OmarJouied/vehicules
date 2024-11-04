import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Table } from '@tanstack/react-table'
import { VehiculeType } from '@/models/Vehicule'

const PageResize = ({ table, size, setSize }: { table: Table<VehiculeType>; size: number | string; setSize: any }) => {

  const handlePageResize: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSize(e.target.value)
  }

  const handlePageResizeCommit: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      const sizeCommit = (table._getCoreRowModel?.()?.rows?.length ?? 0) < +size ? (table._getCoreRowModel?.()?.rows?.length ?? 0) : (+size || 1);
      setSize(sizeCommit);
      table.setPageSize(sizeCommit);
    }
  }

  // useEffect(() => {
  //   setSize(table.getPaginationRowModel().rows.length);
  // }, [pageSize])

  return (
    <Input
      value={size}
      onChange={handlePageResize}
      className="max-w-16 text-center h-full"
      onKeyDown={handlePageResizeCommit}
    />
  )
}

export default PageResize