import {
  Dialog,
  DialogTrigger,
} from "./ui/dialog"
import { PlusIcon } from "lucide-react"
import { Button } from "./ui/button"
import { useContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import ResponseType from "@/types/ResponseType"
import { context } from "@/containers/MainContent"
import Form from "./Form"
import { simplify, SpecificActions } from "@/utils/frontend-functions"

// new Intl.DateTimeFormat(['ban', 'id'], { day: "2-digit", month: "2-digit", year: "numeric" }).format(Date.now())

const AddData = ({ title, fields }: { title: string; fields: string[] }) => {
  const { validation, getRequiredField, getDefaultData, getInputsSpecial, getFields } = new SpecificActions(title as "prix");
  const [data, setData] = useState(getDefaultData());
  const [open, setOpen] = useState(false);
  const { setCurrentData, externalData } = useContext(context) as any;

  const { toast } = useToast();

  const save = async () => {
    const description = validation(data);

    if (description) {
      return toast({
        title: "Erreur des donnees.",
        description,
        variant: "destructive"
      });
    }

    const res = await fetch(`/api/${title}`, {
      method: "POST",
      body: JSON.stringify(
        simplify(title === "deplacements" ? Object.fromEntries(Object.entries(data).filter(item => fields.includes(item[0]))) : data)
      )
    });
    const { message, refData }: ResponseType & { refData: any } = await res.json();

    if (!res.ok) {
      toast({
        title: "Erreur des donnees.",
        description: message,
        variant: "destructive"
      })
    } else {
      toast({
        title: message,
        className: 'bg-success'
      })
      setCurrentData((prev: any) => [refData ? { ...data, _id: refData[0]._id, ...(title === "users" ? { password: "xxxxxxxxxx" } : {}) } : data, ...prev].sort(title === "deplacements" ? undefined : (a: any, b: any) => {
        if (a.matricule > b.matricule) return 1;
        if (a.matricule < b.matricule) return -1;
        return 0;
      }));
      setOpen(false);
    }
  }

  useEffect(() => {
    title === "deplacements" && (setData((prev: any) => ({
      ...prev, carburant_valeur: externalData.vehiculeCurburants.find((v: any) => v.matricule === data.matricule)?.carburantValeur,
      lub_valeur: externalData.lub
    })))
  }, [data.matricule, externalData?.lub, externalData?.vehiculeCurburants, title]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          <span>ajoute {title}</span>
        </Button>
      </DialogTrigger>
      <Form
        title={`Ajoute ${title}`}
        fields={getFields(fields)}
        valueFields={data}
        setValueFields={(field: string, value: string) => setData((prev: any) => ({ ...prev, [field]: value }))}
        requeredFields={getRequiredField()}
        inputsSpecial={getInputsSpecial(data, setData, externalData)}
        handleEnregistrer={save}
        handleDecharge={() => setData(getDefaultData())}
      />
    </Dialog>
  )
}

export default AddData
