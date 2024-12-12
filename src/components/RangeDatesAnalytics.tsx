"use client"

import { FormEventHandler, useCallback, useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import Image from 'next/image'
import InputOTPDate from './InputOTPDate'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SearchIcon } from 'lucide-react'

const RangeDatesAnalytics = () => {
  const [rangeDates, setRangeDates] = useState({
    du: '',
    au: ''
  })
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log({ pathname, rangeDates })
    router.push(pathname + '?' + Object.entries(rangeDates).map(date => `${date[0]}=${decodeURIComponent(date[1])}`).join("&"))
  }

  useEffect(() => {
    const du = searchParams.get('du');
    const au = searchParams.get('au');

    setRangeDates({ du: du ?? "", au: au ?? "" });
  }, [searchParams])

  return (
    <form className='flex gap-4 items-center' onSubmit={handleSubmit}>
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