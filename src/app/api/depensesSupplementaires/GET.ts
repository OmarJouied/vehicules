import DepenseSupplementaire from "@/models/DepenseSupplementaire";
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";
import { pageRowsLength } from "..";

const GET = wrapperEndPoints(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url, `http://localhost:3000`);
    const more = searchParams.get('more');

    const data = await DepenseSupplementaire.find({}, { "__v": 0 })
      .skip(pageRowsLength * Number(more))
      .limit(pageRowsLength)
      .sort({ "matricule": 1 });

    return Response.json({ data }, { status: 200 });
  } catch (err: any) {
    return Response.json({ error: true, message: "Erreur de chargement des donnees: " + err.message } as ResponseType, { status: 500 })
  }
})

export default GET;