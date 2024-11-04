"use client"

import React, { RefObject } from 'react';
import { useReactToPrint } from 'react-to-print'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { PrinterIcon } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { VehiculeType } from '@/models/Vehicule';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


const Printer = ({ contentRef, table, children }: { contentRef: RefObject<Element | Text>; table: Table<VehiculeType>; children: React.ReactNode }) => {
  const reactToPrintFn = useReactToPrint({ contentRef });

  const print = () => {
    table.setPageSize(6)
    // (contentRef.current as Element)?.classList.remove("hidden");
    reactToPrintFn();
    // (contentRef.current as Element)?.classList.add("hidden");
    table.setPageSize(5)

  }

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger onClick={() => reactToPrintFn()} className='bg-primary text-white p-2 rounded-md cursor-pointer'>
        <PrinterIcon />
      </HoverCardTrigger>
      <HoverCardContent>
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}

export default Printer