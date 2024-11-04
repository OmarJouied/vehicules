import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { EditIcon, TrashIcon } from "lucide-react"
import HoverCardButton from "./HoverCardButton"
import { Button } from "./ui/button"
import ResponseType from "@/types/ResponseType"
import { useToast } from "@/hooks/use-toast"
import { VehiculeType } from "@/models/Vehicule"
import { useMemo, useState } from "react"
import AddVehicule from "./AddVehicule"

export default function EditVehicules({ vehicules }: { vehicules: VehiculeType[] }) {
  const [currentIndexToEdit, setCurrentIndexToEdit] = useState(0);
  const fields = useMemo(() => Object.keys(vehicules[0]).filter(field => !field.startsWith("_")), vehicules);
  const { toast } = useToast();

  const deleteVehicules = async () => {
    console.log(vehicules)
    // const res = await fetch('/api/vehicule', {
    //   method: "DELETE",
    //   body: JSON.stringify(vehicules)
    // });

    // const { error, message }: ResponseType = await res.json();
    // toast({
    //   title: message,
    //   ...(error ? { variant: 'destructive' } : {}),
    //   ...(error ? {} : { className: 'bg-success' })
    // })
  }

  return (
    <AddVehicule fields={fields} isEdit vehicules={vehicules} index={currentIndexToEdit} setCurrentIndexToEdit={setCurrentIndexToEdit} />
  )
}
