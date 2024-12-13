import { SearchSelectChoise } from './SearchSelectChoise'
import { GraphiquesMatriculesChoise } from './GraphiquesMatriculesChoise';
import GraphiquesDateFilter from './GraphiquesDateFilter';
import { FormEventHandler, useContext, useEffect, useRef, useState } from 'react';
import { contextGraphiques } from './GraphiquesContent';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PrinterIcon, SearchIcon } from 'lucide-react';
import { Button } from './ui/button';
import Printer from './Printer';

const GraphiquesFilter = () => {
  const { matriculesDepls, currentData } = useContext(contextGraphiques) as any;
  const [filtred, setFiltred] = useState({
    month: "",
    year: "",
    matricules: [],
  })

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [months] = useState(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",]);

  useEffect(() => {
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const matricules = (searchParams.get('matricules') ?? "").split(",").filter(matricule => matricule) as any;

    setFiltred({ year: year ?? "", month: month ? months[+month - 1] : "", matricules });
  }, [searchParams])

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log(filtred.matricules)
    router.push(
      pathname + '?' + Object.entries(
        {
          ...(filtred.year ? { year: filtred.year } : {}), ...(filtred.month ? { month: months.findIndex(month => filtred.month === month) + 1 + "" } : {}),
          ...(filtred.matricules.length ? { matricules: filtred.matricules.join(",") } : {})
        }
      ).map(date => `${date[0]}=${decodeURIComponent(date[1])}`).join("&")
    )
  }

  return (
    <footer className='mt-4 w-full flex justify-between print:justify-center gap-4 items-center flex-wrap'>
      <Printer />
      <form className='flex gap-4 items-center' onSubmit={handleSubmit}>
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