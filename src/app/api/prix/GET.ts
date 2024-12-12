import Prix from "@/models/Prix"
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const GET = wrapperEndPoints(async (req: any) => {
  try {
    const currentPrix = req.nextUrl ? req.nextUrl.searchParams.get("currentPrix") : null;
    let prix = [];
    if (currentPrix) {
      prix = await Prix.aggregate([
        {
          $group: {
            _id: "$prix_name",
            prix: {
              $top: {
                sortBy: {
                  "date": -1
                },
                output: { name: "$prix_name", valeur: "$prix_valeur", est_carburant: "$est_carburant" }
              },
            }
          }
        }
      ])
    } else {
      prix = await Prix.find({}, { "__v": 0 }).sort({ date: -1 })
    }

    return Response.json({ prix }, { status: 200 })
  } catch (err: any) {
    return Response.json({ error: true, message: "Erreur de chargement des donnees " + err.message } as ResponseType, { status: 500 })
  }
})

export default GET