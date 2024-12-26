import Rechange from "@/models/Rechange";
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const GET = wrapperEndPoints(async (req: Request) => {
  try {
    const rechanges = await Rechange.aggregate([
      {
        $addFields: {
          extern: {
            $cond: {
              if: {
                $eq: ['$extern', true]
              },
              then: 'oui',
              else: 'no'
            }
          }
        }
      }
    ]).sort({ date: -1 });

    return Response.json({ rechanges }, { status: 200 });
  } catch {
    return Response.json({ error: true, message: "Erreur de chargement des donnees" } as ResponseType, { status: 500 });
  }
})

export default GET;