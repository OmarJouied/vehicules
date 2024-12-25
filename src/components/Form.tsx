import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import PermissionsForm from './PermissionsForm'
import { pages } from '@/consts'

const Form = ({ fields, title, inputsSpecial, valueFields, setValueFields, requeredFields, handleDecharge, handleEnregistrer, children }:
  {
    fields: any[]; title: string; inputsSpecial: any; valueFields: any; setValueFields: any;
    requeredFields?: string[]; handleDecharge: any; handleEnregistrer: any; children?: React.ReactNode
  }) => (
  <DialogContent className="container bg-wheat flex flex-col min-h-[calc(100vh_-_2rem)]" aria-describedby={undefined}>
    <DialogHeader>
      <DialogTitle className='capitalize'>{title}</DialogTitle>
    </DialogHeader>
    <div className="relative flex-1 overflow-auto flex">
      <div className={`grid grid-cols-1 gap-4 p-2 absolute w-full overflow-hidden ${"md:grid-cols-2"}`}>
        {
          fields.filter(field => title.includes("users") ? !pages.includes(field) : true).map((field) => (
            <Label key={field} className={`flex items-center gap-4 flex-wrap`}>
              <span className={`text-right capitalize ${"min-w-32"}`}>
                {field}
              </span>
              {
                inputsSpecial[field] ? (
                  inputsSpecial[field]
                ) : (
                  <Input
                    id={field}
                    value={valueFields[field]}
                    onChange={({ target: { value } }) => setValueFields(field, value)}
                    required={(requeredFields ?? []).includes(field)}
                    className='flex-1'
                  />
                )
              }
            </Label>
          ))
        }
        {title.includes("users") && <PermissionsForm values={valueFields} setValues={setValueFields} />}
      </div>
    </div>
    <DialogFooter className='gap-2 !space-x-0 flex-col'>
      {children}
      <Button type="submit" onClick={handleDecharge}>Decharge</Button>
      <Button type="submit" onClick={handleEnregistrer}>Enregistrer</Button>
    </DialogFooter>
  </DialogContent>
)

export default Form