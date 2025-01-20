import AddData from "./AddData";
import RangeDatesAnalytics from "./RangeDatesAnalytics";
import FormKilometrage from "./FormKilometrage";

const DataHeader = ({ fields, title }: { fields: string[]; title: string }) => {
  return (
    <header className='w-full flex justify-between gap-4 items-center flex-wrap'>
      <h1 className='text-xl capitalize'>{title}</h1>
      {"analytics" === title ? <RangeDatesAnalytics /> : title === "vidange" ? <FormKilometrage /> : <AddData fields={fields} title={title} />}
    </header>
  )
}

export default DataHeader