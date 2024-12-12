"use client"

import React, { useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PrinterIcon } from 'lucide-react';
import { Button } from './ui/button';

const Printer = () => {
  const [contentRef, setContentRef] = useState({ current: null } as any);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Graphiques",
  });

  useEffect(() => {
    const current = document.querySelector('[data-chart=chart-graph]')?.parentElement;
    setContentRef({ current })
  }, [])

  const printData = () => {
    console.log({ contentRef })
    reactToPrintFn();
  }

  return (
    <Button onClick={printData} className='bg-primary text-white p-4 rounded-md cursor-pointer print:hidden'>
      <span>Imprimante</span>
      <PrinterIcon />
    </Button>
  )
}

export default Printer