"use client"

import { FormEventHandler, useEffect, useState } from 'react'
import { Label } from './ui/label'
import { Button } from './ui/button'
import InputOTPDate from './InputOTPDate'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SearchIcon } from 'lucide-react'

const RangeDatesAnalytics = () => {
  const [rangeDates, setRangeDates] = useState({
    du: '01/01/' + (new Date().getFullYear() + 1),
    au: ''
  })
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    router.push(pathname + '?' + Object.entries(rangeDates).map(date => `${date[0]}=${encodeURIComponent(date[1])}`).join("&"))
  }

  useEffect(() => {
    const du = decodeURIComponent(searchParams.get('du') ?? "01/01/" + (new Date().getFullYear() + 1));
    const au = decodeURIComponent(searchParams.get('au') ?? "");

    setRangeDates({ du, au });
  }, [searchParams])

  return (
    <form className='flex gap-4 justify-end items-center flex-wrap' onSubmit={handleSubmit}>
      <Label className={`flex items-center gap-4 flex-wrap w-48`}>
        <span className={`text-right capitalize`}>
          du
        </span>
        <InputOTPDate date={rangeDates.du} setDate={(date: string) => setRangeDates(prev => ({ ...prev, du: date }))} />
      </Label>
      <Label className={`flex items-center gap-4 flex-wrap w-48`}>
        <span className={`text-right capitalize`}>
          au
        </span>
        <InputOTPDate date={rangeDates.au} setDate={(date: string) => setRangeDates(prev => ({ ...prev, au: date }))} />
      </Label>
      <Button>
        <SearchIcon />
      </Button>
    </form>
  )
}

export default RangeDatesAnalytics