"use client";

import { columns } from '@/components/columns';
import { TableData } from '@/components/TableData';
import DataHeader from '@/components/DataHeader';
import React, { createContext, useEffect, useState } from 'react';

export const context = createContext({});

const MainContent = ({ dataColumns, data, title, externalData }: { dataColumns: string[]; data: any[]; title: string; externalData?: any }) => {
  const [currentData, setCurrentData] = useState(data)
  const columnsName = columns(dataColumns);

  useEffect(() => {
    setCurrentData(data);
  }, [data])

  return (
    <main className='container flex flex-col flex-1'>
      <context.Provider value={{ setCurrentData, externalData }}>
        <DataHeader fields={dataColumns} title={title} />
        <TableData columns={columnsName} data={currentData} title={title} />
      </context.Provider>
    </main>
  )
}

export default MainContent