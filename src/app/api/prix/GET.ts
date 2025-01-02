import Prix from "@/models/Prix"
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";
import { pageRowsLength } from "..";

const GET = wrapperEndPoints(async (req: any) => {
  try {
    const { searchParams } = new URL(`http://localhost/${req.url}`)
    const currentPrix = searchParams.get("currentPrix") ?? "";
    const more = searchParams.get("more") ?? 0;

    let data = [];
    if (currentPrix) {
      data = await Prix.aggregate([
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
      data = await Prix.find({}, { "__v": 0 })
        .skip(pageRowsLength * Number(more))
        .limit(pageRowsLength)
        .sort({ date: -1 })
    }

    return Response.json({ data }, { status: 200 })
  } catch {
    return Response.json({ error: true, message: "Erreur de chargement des donnees" } as ResponseType, { status: 500 })
  }
})

export default GET