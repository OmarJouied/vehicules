import Vehicule from "@/models/Vehicule";
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const DELETE = wrapperEndPoints(async (req: Request) => {
  try {
    const matricules: string[] = await req.json();

    await Vehicule.deleteMany({ matricule: matricules });

    return Response.json({ error: false, message: "Supprime avec succes" } as ResponseType, { status: 202 });
  } catch {
    return Response.json({ error: true, message: "Erreur lors de la suppression du document" } as ResponseType, { status: 500 })
  }
})

export default DELETE;
