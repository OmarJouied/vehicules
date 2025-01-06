import Deplacement from "@/models/Deplacement";
import ResponseType from "@/types/ResponseType";
import { simplifyVidange, wrapperEndPoints } from "@/utils/backend-functions";
import { pageRowsLength } from "..";

const GET = wrapperEndPoints(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url, `http://localhost:3000`);
    const more = searchParams.get('more');

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
      { $skip: pageRowsLength * Number(more) },
      { $limit: pageRowsLength },
    ]).sort({ "_id": 1 });

    return Response.json({ data: simplifyVidange(vidangeState) }, { status: 200 });
  } catch (err: any) {
    return Response.json({ error: true, message: "Erreur de chargement des donnees: " + err.message } as ResponseType, { status: 500 });
  }
})

export default GET;