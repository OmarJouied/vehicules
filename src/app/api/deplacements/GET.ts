import Deplacement from "@/models/Deplacement";
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";
import { pageRowsLength } from "..";

const GET = wrapperEndPoints(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url, `http://localhost:3000`);
    const more = searchParams.get('more');

    const data = await Deplacement.aggregate([
      {
        $addFields: {
          filter_changer: {
            $cond: {
              if: {
                $eq: ['$filter_changer', true]
              },
              then: 'oui',
              else: 'no'
            }
          }
        }
      },
      { $skip: pageRowsLength * Number(more) },
      { $limit: pageRowsLength },
    ]).sort({ date: -1 });

    return Response.json({ data }, { status: 200 });
  } catch (err: any) {
    return Response.json({ error: true, message: "Erreur de chargement des donnees: " + err.message } as ResponseType, { status: 500 })
  }
})

export default GET;