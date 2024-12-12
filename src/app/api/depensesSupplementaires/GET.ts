import DepenseSupplementaire from "@/models/DepenseSupplementaire";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";

const GET = wrapperEndPoints(async (req: Request) => {
  try {
    const depensesSupplementaires = await DepenseSupplementaire.find({}, { "__v": 0 }).sort({ "matricule": 1 });
    // console.log({ depensesSupplementaires })
    return Response.json({ depensesSupplementaires }, { status: 200 });
  } catch {
    return Response.json({ error: true, message: "Erreur de chargement des donnees" } as ResponseType, { status: 500 });
  }
})

export default GET;