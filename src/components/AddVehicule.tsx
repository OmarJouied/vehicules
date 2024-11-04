import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { ArrowBigLeft, ArrowBigRight, EditIcon, PlusIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useContext, useEffect, useState } from "react"
import InputDate from "./InputDate"
import { useToast } from "@/hooks/use-toast"
import ResponseType from "@/types/ResponseType"
import { VehiculeType } from "@/models/Vehicule"
import HoverCardButton from "./HoverCardButton"
import { context } from "@/containers/MainContent"
import InputOTPDate from "./InputOTPDate"

// new Intl.DateTimeFormat(['ban', 'id'], { day: "2-digit", month: "2-digit", year: "numeric" }).format(Date.now())

const defaultData = {
  matricule: "", affectation: undefined, assurance: 0, carnet_metrologe: 0, dateachat: undefined,
  datemc: undefined, genre: undefined, marque: undefined, numchassis: undefined, observation: undefined, poids: 0, prix_aquisiti: 0,
  taxe_tenage: 0, type: undefined, type_curburant: undefined, vignte: 0, visite_technique: 0
};

const AddVehicule = ({ title, fields, isEdit, vehicules, setCurrentIndexToEdit, index }: { title: string; fields: string[]; isEdit?: boolean; vehicules?: VehiculeType[]; setCurrentIndexToEdit?: any; index?: number }) => {
  const [vehiclueData, setVehiclueData] = useState(vehicules?.[index ?? 0] ?? defaultData)
  const [open, setOpen] = useState(false)
  const { setCurrentData } = useContext(context) as any;

  const { toast } = useToast();

  const save = async () => {
    const className = "bg-danger text-white";
    if (!vehiclueData.matricule) {
      toast({
        title: "Erreur de donnees.",
        description: "Merci de remplir le champ matricule.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
        className
      })
      return;
    }
    if (vehiclueData.datemc && !(vehiclueData.datemc + "").match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      toast({
        title: "Erreur de donnees.",
        description: "Entrez une date valide pour datemc.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
        variant: "destructive"
      })
      return;
    }
    if (vehiclueData.dateachat && !`${vehiclueData.dateachat}`.match(/^\d{4}$/)) {
      toast({
        title: "Erreur de donnees.",
        description: "Entrez une date valide pour dateachat.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
        variant: "destructive"
      })
      return;
    }

    const res = await fetch('/api/vehicule', {
      method: isEdit ? "PATCH" : "POST",
      body: JSON.stringify(vehiclueData)
    });
    const { message }: ResponseType = await res.json();

    if (!res.ok) {
      toast({
        title: "Erreur de donnees.",
        description: message,
        variant: "destructive"
      })
    } else {
      toast({
        title: message,
        className: 'bg-success'
      })
      setCurrentData((prev: any) => isEdit ? [...prev.slice(0, index), vehiclueData, ...prev.slice((index ?? 0) + 1)] : [vehiclueData, ...prev]);
      if (isEdit) {
        if (index === vehicules?.length! - 1) {
          setOpen(false);
          return;
        }
        setCurrentIndexToEdit((prev: number) => ++prev);
      }
    }
  }
  console.log(vehiclueData)
  useEffect(() => {
    isEdit && vehicules?.[(index ?? 0)] && setVehiclueData(vehicules?.[(index ?? 0)]!);
  }, [open])

  useEffect(() => {
    isEdit && setVehiclueData(vehicules?.[(index ?? 0)]!);
  }, [index])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {
          isEdit ? (
            <Button className="p-0">
              <HoverCardButton className="px-3 bg-warn text-wheat" label="Modifier"><EditIcon /></HoverCardButton>
            </Button>
          ) : (
            <Button>
              <PlusIcon />
              <span>ajoute {title}</span>
            </Button>
          )
        }
      </DialogTrigger>
      <DialogContent className="container  flex flex-col min-h-[40.2rem]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{isEdit ? `Modifier Vehicule: ${vehicules?.[(index ?? 0)]?.matricule}` : "Ajoute Vehicule"}</DialogTitle>
        </DialogHeader>
        <div className="relative flex-1 overflow-auto">
          <div className="flex flex-wrap gap-4 py-4 px-2 absolute w-full overflow-hidden">
            <div className="flex flex-1 flex-col gap-4 min-w-80">
              {
                fields.slice(0, Math.ceil(fields.length / 2)).map((field) => (
                  <div key={field} className="flex items-center gap-4">
                    <Label htmlFor={field} className="text-right capitalize min-w-32">
                      {field}
                    </Label>
                    {
                      field === "datemc" ? (
                        // <InputDate
                        //   id={field}
                        //   onChange={({ target: { value } }) => setVehiclueData((prev: any) => ({ ...prev, [field]: value }))}
                        //   placeholder="17/02/2022"
                        //   value={vehiclueData[field] as string}
                        //   errorCondition={!!(vehiclueData[field] && !(vehiclueData[field] as string).match(/^\d{2}\/\d{2}\/\d{4}$/))}
                        // />
                        // <div className="col-span-3">
                        <InputOTPDate date={vehiclueData.datemc + ""} setDate={(value: any) => setVehiclueData(prev => ({ ...prev, datemc: value }))} />
                        // </div>
                      ) : field === "dateachat" ? (
                        <InputDate
                          id={field}
                          onChange={({ target: { value } }) => setVehiclueData((prev: any) => ({ ...prev, [field]: value.match(/^\d{1}/) ? +value : undefined }))}
                          placeholder="2022"
                          value={vehiclueData[field] ? vehiclueData[field] + "" : ""}
                          errorCondition={!!(vehiclueData[field] && !`${vehiclueData[field]}`.match(/^\d{4}$/))}
                        />
                      ) : (
                        <Input
                          id={field}
                          value={vehiclueData[field] ? vehiclueData[field] + "" : ""}
                          onChange={({ target: { value } }) => setVehiclueData((prev: any) => ({ ...prev, [field]: value ? value : undefined }))}
                          required={field === "matricule"}
                        />
                      )
                    }
                  </div>
                ))
              }
            </div>
            <div className="flex flex-1 flex-col gap-4 min-w-80">
              {
                fields.slice(Math.ceil(fields.length / 2)).map((field) => (
                  <div key={field} className="flex items-center gap-4">
                    <Label htmlFor={field} className="text-right capitalize min-w-32">
                      {field}
                    </Label>
                    {
                      field === "datemc" ? (
                        // <InputDate
                        //   id={field}
                        //   onChange={({ target: { value } }) => setVehiclueData((prev: any) => ({ ...prev, [field]: value }))}
                        //   placeholder="17/02/2022"
                        //   value={vehiclueData[field] as string}
                        //   errorCondition={!!(vehiclueData[field] && !(vehiclueData[field] as string).match(/^\d{2}\/\d{2}\/\d{4}$/))}
                        // />
                        // <div className="col-span-3">
                        <InputOTPDate />
                        // </div>
                      ) : field === "dateachat" ? (
                        <InputDate
                          id={field}
                          onChange={({ target: { value } }) => setVehiclueData((prev: any) => ({ ...prev, [field]: +value }))}
                          placeholder="2022"
                          value={vehiclueData[field] + ""}
                          errorCondition={!!(vehiclueData[field] && !`${vehiclueData[field]}`.match(/^\d{4}$/))}
                        />
                      ) : (
                        <Input
                          id={field}
                          className="col-span-3"
                          value={vehiclueData[field] as string}
                          onChange={({ target: { value } }) => setVehiclueData((prev: any) => ({ ...prev, [field]: value }))}
                          required={field === "matricule"}
                        />
                      )
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <DialogFooter>
          {isEdit && (
            <>
              <Button type="submit" onClick={() => setCurrentIndexToEdit((prev: number) => --prev)} disabled={index === 0}><ArrowBigLeft /></Button>
              <Button type="submit" onClick={() => setCurrentIndexToEdit((prev: number) => ++prev)} disabled={(index ?? 0) >= vehicules?.length! - 1}><ArrowBigRight /></Button>
            </>
          )}
          <Button type="submit" onClick={() => setVehiclueData(defaultData)}>Decharge</Button>
          <Button type="submit" onClick={save}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddVehicule
