import { SearchSelectChoise } from './SearchSelectChoise'
import { GraphiquesMatriculesChoise } from './GraphiquesMatriculesChoise';
import GraphiquesDateFilter from './GraphiquesDateFilter';
import { FormEventHandler, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { contextGraphiques } from './GraphiquesContent';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PrinterIcon, SearchIcon } from 'lucide-react';
import { Button } from './ui/button';
import Printer from './Printer';

const GraphiquesFilter = () => {
  const { matriculesDepls } = useContext(contextGraphiques) as any;
  const [filtred, setFiltred] = useState({
    month: "",
    year: "",
    matricules: [],
  })

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const months = useMemo(() => ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",], []);

  useEffect(() => {
    const year = decodeURIComponent(searchParams.get('year') ?? "");
    const month = decodeURIComponent(searchParams.get('month') ?? "");
    const matricules = (searchParams.get('matricules') ?? "").split(",").filter(matricule => matricule) as any;

    setFiltred({ year: year ?? "", month: month ? months[+month - 1] : "", matricules });
  }, [searchParams, months])

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    router.push(
      pathname + '?' + Object.entries(
        {
          ...(filtred.year ? { year: encodeURIComponent(filtred.year) } : {}), ...(filtred.month ? { month: encodeURIComponent(months.findIndex(month => filtred.month === month) + 1 + "") } : {}),
          ...(filtred.matricules.length ? { matricules: filtred.matricules.join(",") } : {})
        }
      ).map(date => `${date[0]}=${decodeURIComponent(date[1])}`).join("&")
    )
  }

  return (
    <footer className='mt-4 w-full flex justify-between print:justify-center gap-4 items-center flex-wrap'>
      <Printer />
      <form className='flex gap-4 items-center flex-wrap' onSubmit={handleSubmit}>
        <div className="max-w-sm">
          <GraphiquesMatriculesChoise values={filtred.matricules} choises={matriculesDepls.map((item: { _id: any; }) => item._id)} onChange={setFiltred} />
        </div>
        <GraphiquesDateFilter month={filtred.month} months={months} year={filtred.year} onChange={setFiltred} />
        <Button className='print:hidden'>
          <SearchIcon />
        </Button>
      </form>
    </footer>
  )
}

export default GraphiquesFilter