import PermissionsForPage from './PermissionsForPage';
import { pages } from '@/consts';

const PermissionsForm = ({ setValues, values }: { setValues: any; values: any }) => {
  const pagesPermissions = Object.fromEntries(Object.entries(values).filter(item => pages.includes(item[0])));
  return (
    <div className='col-span-2 flex flex-col gap-4'>
      <h3 className='font-bold'>Permissions</h3>
      {
        pages.map((page) => (
          <PermissionsForPage page={page} key={page} permissions={(pagesPermissions[page] as string).split(', ')} setPermissions={setValues} />
        ))
      }
    </div>
  )
}

export default PermissionsForm