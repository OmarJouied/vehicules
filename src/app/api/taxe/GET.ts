import Taxe from "@/models/Taxe"
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const GET = wrapperEndPoints(async (req: any) => {
  try {
    const taxe = await Taxe.find({}, { "__v": 0 }).sort({ date: -1 })

    return Response.json({ taxe }, { status: 200 })
  } catch {
    return Response.json({ error: true, message: "Erreur de chargement des donnees" } as ResponseType, { status: 500 })
  }
})

export default GET