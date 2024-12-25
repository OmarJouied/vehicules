import Deplacement from "@/models/Deplacement";
import ResponseType from "@/types/ResponseType";
import { simplifyGraph, wrapperEndPoints } from "@/utils/backend-functions";

const GET = wrapperEndPoints(async (req: Request) => {
  try {
    const { searchParams } = new URL(`http://localhost/${req.url}`)
    const year = searchParams.get("year") ?? "";
    const month = searchParams.get("month") ?? "";
    const matricules = searchParams.get("matricules");

    const deplacementsGraph = await Deplacement.aggregate([
      {
        $match: {
          ...(matricules ? { matricule: { $in: matricules.split(',') } } : {}),
          ...((year || month) ? {
            date: {
              $gte: new Date(`${+(year || new Date().getFullYear())}-${month}`),
              $lt: new Date(`${+(year || new Date().getFullYear()) + (month && (+month < 12) ? 0 : 1)}-${month && (+month < 12) ? +month + 1 : ""}`),
            }
          } : {}),
        }
      },
      {
        $sort: { date: -1 }
      },
      {
        $group: {
          _id: { ...(month ? { date: { $dayOfMonth: "$date" } } : year ? { date: { $month: "$date" } } : { date: { $year: "$date" } }) },
          kilometrage: { $sum: "$kilometrage" },
          lub: { $sum: { $sum: ["$qte_lub", "$vidange"] } },
          carburant: { $sum: "$qte_carburant" },
          carb_ext: { $sum: "$qte_carburant_ext" },
        },
      },
    ]).sort({ "_id": 1 });

    const [{ min, max }] = await Deplacement.aggregate([
      {
        $group: {
          _id: null,
          min: { $min: { $year: "$date" } },
          max: { $max: { $year: "$date" } },
        },
      },
    ]).sort({ "_id": 1 });

    const matriculesDepls = await Deplacement.aggregate([
      {
        $group: {
          _id: "$matricule",
        },
      },
    ]).sort({ "_id": 1 });

    const years = Array.from({ length: max - min + 1 }, (_: any, k: any) => k + min + "")

    // return Response.json({ deplacementsGraph }, { status: 200 });
    return Response.json({ years, matriculesDepls, deplacementsGraph: simplifyGraph(deplacementsGraph, { month, year }, years) }, { status: 200 });
  } catch {
    return Response.json({ error: true, message: "Erreur de chargement des donnees" } as ResponseType, { status: 500 });
  }
})

export default GET;