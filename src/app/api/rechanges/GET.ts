import Rechange from "@/models/Rechange";
import ResponseType from "@/types/ResponseType";
import { simplifyRechanges, wrapperEndPoints } from "@/utils/backend-functions";

const GET = wrapperEndPoints(async (req: Request) => {
  try {
    const rechanges = await Rechange.find({}, { __v: 0 }).sort({ date: -1 });

    return Response.json({ rechanges: rechanges.map(rechange => simplifyRechanges(rechange)) }, { status: 200 });
  } catch {
    return Response.json({ error: true, message: "Erreur de chargement des donnees" } as ResponseType, { status: 500 });
  }
})

export default GET;