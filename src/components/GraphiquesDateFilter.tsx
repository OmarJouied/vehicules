"use client"

import { useContext } from 'react'
import { Label } from './ui/label'
import { SearchSelectChoise } from './SearchSelectChoise'
import { contextGraphiques } from './GraphiquesContent'

const GraphiquesDateFilter = ({ onChange, year, month, months }: { year: string; month: string; onChange: any; months: string[] }) => {
  const { years } = useContext(contextGraphiques) as any;

  return (
    <>
      <Label className={`flex items-center gap-4 flex-wrap w-56`}>
        <span className={`text-right capitalize`}>
          year
        </span>
        <SearchSelectChoise choises={years} value={year} name='year' onChange={({ target: { value } }) => onChange((prev: any) => ({ ...prev, year: value }))} />
      </Label>
      <Label className={`flex items-center gap-4 flex-wrap w-56`}>
        <span className={`text-right capitalize`}>
          month
        </span>
        <SearchSelectChoise choises={months} value={month} name='month' onChange={({ target: { value } }) => onChange((prev: any) => ({ ...prev, month: value }))} />
      </Label>
    </>
  )
}

export default GraphiquesDateFilter