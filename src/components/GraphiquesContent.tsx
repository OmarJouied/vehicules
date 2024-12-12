"use client";

import React, { createContext, useEffect, useState } from 'react';
import { Graphiques } from './Graphiques';
import GraphiquesFilter from './GraphiquesFilter';

export const contextGraphiques = createContext({});

const GraphiquesContent = ({ data, years, matriculesDepls }: { data: any[]; years: any; matriculesDepls: any }) => {
  const [currentData, setCurrentData] = useState(data);

  useEffect(() => {
    setCurrentData(data);
  }, [data])

  return (
    <main className='container print:p-0 print:m-0 print:min-w-full print:h-[100vh] print:bg-inherit'>
      <contextGraphiques.Provider value={{ currentData, setCurrentData, years, matriculesDepls }}>
        {/* <DataHeader fields={dataColumns} title={title} /> */}
        <Graphiques chartData={currentData} />
        <GraphiquesFilter />
      </contextGraphiques.Provider>
    </main>
  )
}

export default GraphiquesContent