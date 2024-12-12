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
import { Button } from "./ui/button"
import ResponseType from "@/types/ResponseType"
import { useToast } from "@/hooks/use-toast"
import { useContext, useState } from "react"
import { context } from "@/containers/MainContent"

export default function DeleteItems({ ids, deleteAction, table, target }: { ids: string[]; deleteAction?: any; table: any; target?: string }) {
  const [open, setOpen] = useState(false);
  const { setCurrentData } = useContext(context) as any;
  const { toast } = useToast();

  const deleteItems = deleteAction ? deleteAction : async () => {
    const res = await fetch(`/api/${target}`, {
      method: "DELETE",
      body: JSON.stringify(ids)
    });

    const { error, message }: ResponseType = await res.json();
    toast({
      title: message,
      ...(error ? { variant: 'destructive' } : {}),
      ...(error ? {} : { className: 'bg-success' })
    })
    if (!error) {
      setCurrentData((prev: any[]) => [...prev.filter(row => !ids.includes(row._id))]);
      setOpen(false);
      table.resetRowSelection();
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="p-4 bg-danger hover:bg-danger/90 text-primary-foreground">
          <span>Supprimer</span>
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-wheat">
        <AlertDialogHeader>
          <AlertDialogTitle>Voulez-vous vraiment les supprimer?</AlertDialogTitle>
          <AlertDialogDescription>
            Vous ne pourrez plus revenir en arriere apres cela. <br />
            {ids.length} element{ids.length > 1 && "s"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">Annuler</AlertDialogCancel>
          <AlertDialogAction className="bg-danger hover:bg-danger/90" onClick={deleteItems}>Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
