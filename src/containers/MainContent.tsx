"use client";

import { columns } from '@/components/columns';
import { TableData } from '@/components/TableData';
import DataHeader from '@/components/DataHeader'
import { VehiculeType } from '@/models/Vehicule';
import React, { createContext, useState } from 'react'

export const context = createContext({});

const MainContent = ({ dataColumns, data, title }: { dataColumns: string[]; data: VehiculeType[]; title: string }) => {
  const [currentData, setCurrentData] = useState(data)
  const columnsName = columns(dataColumns);

  return (
    <main className='container'>
      <context.Provider value={{ setCurrentData }}>
        <DataHeader fields={dataColumns} title={title} />
        <TableData columns={columnsName} data={currentData} />
      </context.Provider>
    </main>
  )
}

export default MainContent