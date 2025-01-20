import { FormEventHandler, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { SearchIcon } from 'lucide-react';

const FormKilometrage = () => {
  const [kilometrage, setKilometrage] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    router.push(`${pathname}?kilometrage=${kilometrage}`);
  }

  useEffect(() => {
    const kilometrage = searchParams.get('kilometrage') ?? "";

    setKilometrage(kilometrage);
  }, [searchParams])

  return (
    <form className='flex gap-4 justify-end items-center flex-wrap' onSubmit={handleSubmit}>
      <Label className={`flex items-center gap-4 flex-wrap w-48`}>
        <span className={`text-right capitalize`}>
        kilometrage
        </span>
        <Input
          id={"kilometrage"}
          value={kilometrage}
          onChange={({ target: { value } }) => setKilometrage(value)}
          className='flex-1'
        />
      </Label>
      <Button>
        <SearchIcon />
      </Button>
    </form>
  )
}

export default FormKilometrage;