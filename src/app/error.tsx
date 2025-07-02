'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react';

const Error = ({ error: { message }, reset }: { error: Error, reset: () => void }) => {
  const router = useRouter();
  const reload = () => {
    startTransition(() => {
      router.refresh();
      reset();
    })
  }

  return (
    <div className="container flex flex-col justify-center">
      <h1 className="text-center text-9xl leading-[10rem] ">500</h1>
      <h2 className="mt-5 mb-8 mx-auto text-2xl text-extralight ">Erreur Inattendue <b>:(</b></h2>
      <p className="text-center text-xl text-extralight">
        {message}
      </p>
      <Button onClick={reload} className="mt-5 px-5 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
        Retry
      </Button>
    </div>
  )
}

export default Error