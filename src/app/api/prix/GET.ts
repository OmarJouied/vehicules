import Prix from "@/models/Prix"
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const GET = wrapperEndPoints(async (req: any) => {
  try {
    const { searchParams } = new URL(`http://localhost/${req.url}`)
    const currentPrix = searchParams.get("currentPrix") ?? "";
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
  } catch {
    return Response.json({ error: true, message: "Erreur de chargement des donnees" } as ResponseType, { status: 500 })
  }
})

export default GET