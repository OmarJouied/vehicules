import Deplacement from "@/models/Deplacement";
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const GET = wrapperEndPoints(async (req: Request) => {
  try {
    const deplacements = await Deplacement.aggregate([
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
      }
    ]).sort({ date: -1 });

    return Response.json({ deplacements }, { status: 200 });
  } catch {
    return Response.json({ error: true, message: "Erreur de chargement des donnees" } as ResponseType, { status: 500 });
  }
})

export default GET;