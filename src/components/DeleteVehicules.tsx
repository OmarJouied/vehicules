import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { TrashIcon } from "lucide-react"
import HoverCardButton from "./HoverCardButton"
import { Button } from "./ui/button"
import ResponseType from "@/types/ResponseType"
import { useToast } from "@/hooks/use-toast"

export default function DeleteVehicules({ matricules }: { matricules: string[] }) {
  const { toast } = useToast();

  const deleteVehicules = async () => {
    const res = await fetch('/api/vehicule', {
      method: "DELETE",
      body: JSON.stringify(matricules)
    });

    const { error, message }: ResponseType = await res.json();
    toast({
      title: message,
      ...(error ? { variant: 'destructive' } : {}),
      ...(error ? {} : { className: 'bg-success' })
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="p-0">
          <HoverCardButton className="px-3 bg-danger text-wheat" label="Supprimer"><TrashIcon /></HoverCardButton>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Voulez-vous vraiment les supprimer?</AlertDialogTitle>
          <AlertDialogDescription>
            Vous ne pourrez plus revenir en arriere apres cela. <br />
            {matricules.length} element{matricules.length > 1 && "s"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">Annuler</AlertDialogCancel>
          <AlertDialogAction className="bg-danger hover:bg-danger/90" onClick={deleteVehicules}>Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
