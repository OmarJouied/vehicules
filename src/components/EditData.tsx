import { ArrowBigLeft, ArrowBigRight, EditIcon } from "lucide-react"
import { Button } from "./ui/button"
import ResponseType from "@/types/ResponseType"
import { useToast } from "@/hooks/use-toast"
import { VehiculeType } from "@/models/Vehicule"
import { useContext, useEffect, useState } from "react"
import { Dialog, DialogTrigger } from "./ui/dialog"
import Form from "./Form"
import { context } from "@/containers/MainContent"
import { simplify, SpecificActions } from "@/utils/frontend-functions"

export default function EditData({ data, fields, editAction, target, table }: { data: VehiculeType[], fields: string[]; editAction?: any; target: string; table: any }) {
  const { validation, getRequiredField, getDefaultData, getInputsSpecial, getFields } = new SpecificActions(target as "prix");
  const [currentData, setCurrentData] = useState(data.map(row => ({ ...getDefaultData(), ...row })));
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const { setCurrentData: setRootData, externalData } = useContext(context) as any;
  const { toast } = useToast();

  const save = editAction ? () => {
    for (let element = 0; element < currentData.length; element++) {
      const description = validation(currentData[element]);

      if (description) {
        return toast({
          title: "Erreur de donnees en element " + (element + 1),
          description,
          variant: "destructive"
        });
      }
    }

    editAction(currentData);
    setOpen(false);
  } : async () => {
    for (const element of currentData) {
      const description = validation(element);

      if (description) {
        return toast({
          title: "Erreur des donnees.",
          description,
          variant: "destructive"
        });
      }
    }

    const res = await fetch(`/api/${target}`, {
      method: "PATCH",
      body: JSON.stringify(currentData.map(element => simplify(element)))
    });
    const { message }: ResponseType = await res.json();

    if (!res.ok) {
      toast({
        title: "Erreur des donnees.",
        description: message,
        variant: "destructive"
      })
    } else {
      table.resetRowSelection();
      toast({
        title: message,
        className: 'bg-success'
      })
      setRootData((prev: any) => {
        for (const element of currentData) {
          const absoluteIndex = prev.findIndex((item: any) => item._id === element._id);
          prev = [...prev.slice(0, absoluteIndex), target === "users" ? { ...element, password: "xxxxxxxxxx" } : element, ...prev.slice(absoluteIndex + 1)];
        }
        return prev.sort(target === "vehicules" ? (a: any, b: any) => {
          if (a.matricule > b.matricule) return 1;
          if (a.matricule < b.matricule) return -1;
          return 0;
        } : undefined)
      });
      setOpen(false);
    }
  }

  const editSpecial = (func: any) => {
    setCurrentData(prev => [...prev.slice(0, index), func(currentData[index]), ...prev.slice(index + 1)])
  }

  const cancel = () => {
    const requeredFields = getRequiredField() as any[];
    const defaultData = getDefaultData();

    setCurrentData(prev => [
      ...prev.slice(0, index),
      { ...currentData[index], ...Object.keys(defaultData).reduce((item, next) => ({ ...item, ...(requeredFields.includes(next) ? {} : { [next]: defaultData[next] }) }), {}) },
      ...prev.slice(index + 1)
    ]);
  }

  useEffect(() => {
    target === "deplacements" && (setCurrentData(prev => [...prev.slice(0, index), {
      ...prev[index], carburant_valeur: externalData.vehiculeCurburants.find((v: any) => v.matricule === currentData[index].matricule)?.carburantValeur,
      lub_valeur: externalData.lub
    }, ...prev.slice(index + 1)])
    )
  }, [currentData[index]?.matricule]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="p-4 bg-warn hover:bg-warn/90 text-primary-foreground">
          <span>Modifier</span>
          <EditIcon />
        </Button>
      </DialogTrigger>
      <Form
        fields={getFields(fields)}
        title={`Modifier ${target}`}
        valueFields={currentData[index]}
        setValueFields={(field: string, value: string) => setCurrentData((prev: any) => ([...prev.slice(0, index), { ...prev[index], [field]: value }, ...prev.slice(index + 1)]))}
        requeredFields={getRequiredField()}
        inputsSpecial={getInputsSpecial(currentData[index], editSpecial, externalData)}
        handleEnregistrer={save}
        handleDecharge={cancel}
      >
        <Button type="submit" onClick={() => setIndex((prev: number) => --prev)} disabled={index === 0}><ArrowBigLeft /></Button>
        <Button type="submit" onClick={() => setIndex((prev: number) => ++prev)} disabled={index >= currentData?.length! - 1}><ArrowBigRight /></Button>
      </Form>
    </Dialog>
  )
}
