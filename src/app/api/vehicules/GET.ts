import DepenseSupplementaire from "@/models/DepenseSupplementaire";
import Vehicule from "@/models/Vehicule";
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const GET = wrapperEndPoints(async (req: Request) => {
  try {
    const vehicules = await Vehicule.aggregate([
      {
        $lookup: {
          from: 'vehiculetypecarburants',
          localField: 'matricule',
          foreignField: 'matricule',
          as: 'type_carburant',
          pipeline: [
            {
              $sort: {
                'date': -1
              }
            },
            {
              $limit: 1
            },
            {
              $project: { "type_carburant": 1, "_id": 0 }
            },
          ]
        },
      },
      {
        $lookup: {
          from: 'depensesupplementaires',
          localField: 'matricule',
          foreignField: 'matricule',
          as: 'depensesupplementaires',
          pipeline: [
            {
              $group: {
                _id: "$type_depense",
                valeur: { $last: "$valeur" }
              }
            },
            // {
            //   $sort: {
            //     'date': -1
            //   }
            // },
            // {
            //   $limit: 1
            // },
            // {
            //   $project: { "type_depense": 1, "_id": 0 }
            // },
            // {
            //   $unwind: "$type_carburant"
            // },
          ]
        },
      },
    ]).sort({ "matricule": 1 });

    return Response.json({ vehicules }, { status: 200 });
  } catch {
    return Response.json({ error: true, message: "Erreur de chargement des donnees" } as ResponseType, { status: 500 });
  }
})

export default GET;