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
          annee
        </span>
        <SearchSelectChoise choises={years} value={year} name='annee' onChange={({ target: { value } }) => onChange((prev: any) => ({ ...prev, year: value }))} />
      </Label>
      <Label className={`flex items-center gap-4 flex-wrap w-56`}>
        <span className={`text-right capitalize`}>
          mois
        </span>
        <SearchSelectChoise choises={months} value={month} name='mois' onChange={({ target: { value } }) => onChange((prev: any) => ({ ...prev, month: value }))} />
      </Label>
    </>
  )
}

export default GraphiquesDateFilter