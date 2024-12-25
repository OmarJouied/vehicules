import React, { useMemo } from 'react'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'

const PermissionsForPage = ({ page, permissions, setPermissions }: { page: string; permissions: string[]; setPermissions: any }) => {
  const permissionsChoises = useMemo(() => ["Tous", "Lire", "Ecrire", "Modifier", "Supprimer",], []);

  return (
    <div className='flex justify-between gap-2.5'>
      <h3>{page}</h3>
      <div className="flex gap-2.5">
        {
          permissionsChoises.map(permission => (
            <Label key={permission} className={`flex items-center gap-2.5 flex-wrap`}>
              <span className={"text-right"}>
                {permission}
              </span>
              {
                <Checkbox
                  id={permission}
                  checked={permissions.includes(permission)}
                  className='flex-1'
                  onCheckedChange={() => setPermissions(page, (permissions.includes(permission) ? permissions.filter(p => p !== permission) : [permission, ...permissions]).join(", "))}
                />
              }
            </Label>
          ))
        }
      </div>
    </div>
  )
}

export default PermissionsForPage