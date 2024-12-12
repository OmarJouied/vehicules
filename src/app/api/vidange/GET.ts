import Deplacement from "@/models/Deplacement";
import ResponseType from "@/types/ResponseType";
import { simplifyVidange, wrapperEndPoints } from "@/utils/backend-functions";

const GET = wrapperEndPoints(async (req: Request) => {
  try {
    const vidangeState = await Deplacement.aggregate([
      {
        $sort: { date: -1 }
      },
      {
        $group: {
          _id: "$matricule",
          depls: { $push: { kilometrage: "$kilometrage", vidange: "$vidange", filter_changer: "$filter_changer" } }
        },
      },
    ]).sort({ "_id": 1 });

    return Response.json({ vidangeState: simplifyVidange(vidangeState) }, { status: 200 });
  } catch {
    return Response.json({ error: true, message: "Erreur de chargement des donnees" } as ResponseType, { status: 500 });
  }
})

export default GET;