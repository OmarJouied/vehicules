import Prix from "@/models/Prix";
import Vehicule from "@/models/Vehicule";
import ResponseType from "@/types/ResponseType";
import { NormalDate, simplifyAnalytics, wrapperEndPoints } from "@/utils/backend-functions";

const GET = wrapperEndPoints(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url)
    const du = new NormalDate(searchParams.get("du") ?? "").parse() ?? "";
    const au = new NormalDate(searchParams.get("au") ?? "").parse() ?? "";
    let start = du > au ? au : du;
    let end = du < au ? au : du;

    const analytics = await Vehicule.aggregate([
      {
        $lookup: {
          from: 'deplacements',
          localField: 'matricule',
          foreignField: 'matricule',
          as: 'vehiculeDeplacements',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: start && end || !start && !end ? [{
                    $gte: start ? ["$date", start] : [1, 0],
                  }, {
                    $lte: end ? ["$date", end] : [0, 1],
                  }] : [{
                    $eq: ["$date", start || end]
                  }]
                }
              }
            }
          ]
        },
      },
      {
        $lookup: {
          from: 'depensesupplementaires',
          localField: 'matricule',
          foreignField: 'matricule',
          as: 'vehiculeDepenseSupplementaires',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: start && end || !start && !end ? [{
                    $gte: start ? ["$date", start] : [1, 0],
                  }, {
                    $lte: end ? ["$date", end] : [0, 1],
                  }] : [{
                    $eq: ["$date", start || end]
                  }]
                }
              }
            },
            {
              $group: {
                _id: "$type_depense",
                valeur: { $sum: "$valeur" }
              }
            }
          ]
        },
      },
      {
        $lookup: {
          from: 'vehiculetypecarburants',
          localField: 'matricule',
          foreignField: 'matricule',
          as: 'typecarburants',
          pipeline: [
            {
              $project: { "type_carburant": 1, "date": 1, "_id": 0 }
            },
            {
              $sort: {
                'date': -1
              }
            },
          ]
        },
      },
    ]).project({ matricule: 1, marque: 1, typecarburants: 1, vehiculeDeplacements: 1, vehiculeDepenseSupplementaires: 1, _id: 0 });
    const prix = await Prix.find().sort({ date: -1 });

    return Response.json({
      analytics: analytics
        .map(row => simplifyAnalytics(
          row,
          prix
        ))
    }, { status: 200 })
  } catch {
    return Response.json({ error: true, message: "Erreur de chargement des donnees" } as ResponseType, { status: 500 })
  }
})

export default GET