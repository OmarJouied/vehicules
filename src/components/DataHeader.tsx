import AddVehicule from './AddVehicule'

const DataHeader = ({ fields, title }: { fields: string[]; title: string }) => {
  return (
    <header className='w-full flex justify-between gap-4 items-center'>
      <h1 className='text-xl'>{title}</h1>
      <AddVehicule fields={fields} title={title.toLowerCase()} />
    </header>
  )
}

export default DataHeader