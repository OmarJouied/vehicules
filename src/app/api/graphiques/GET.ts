import Deplacement from "@/models/Deplacement";
import Rechange from "@/models/Rechange";
import Vehicule from "@/models/Vehicule";
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

    const { min, max } = (await Deplacement.aggregate([
      {
        $group: {
          _id: null,
          min: { $min: { $year: "$date" } },
          max: { $max: { $year: "$date" } },
        },
      },
    ]).sort({ "_id": 1 })).pop() ?? { min: 0, max: 0 };

    const matriculesDepls = await Vehicule.aggregate([
      {
        $group: {
          _id: "$matricule",
        },
      },
    ]).sort({ "_id": 1 });

    const rechangesGraph = await Rechange.aggregate([
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
          rechange: { $sum: "$qte" },
        },
      },
    ]).sort({ "_id": 1 });

    const years = Array.from({ length: max - min + 1 }, (_: any, k: any) => k + min + "")

    return Response.json({ years, matriculesDepls, deplacementsGraph: simplifyGraph(deplacementsGraph, rechangesGraph, { month, year }, years) }, { status: 200 });
  } catch (err: any) {
    return Response.json({ error: true, message: "Erreur de chargement des donnees: " + err.message } as ResponseType, { status: 500 })
  }
})

export default GET;