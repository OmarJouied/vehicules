import Vehicule from "@/models/Vehicule";
import ResponseType from "@/types/ResponseType";
import { simplifyVehicules, wrapperEndPoints } from "@/utils/backend-functions";
import { pageRowsLength } from "..";

const GET = wrapperEndPoints(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url, `http://localhost:3000`);
    const more = searchParams.get('more');

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
          ]
        },
      },
      { $skip: pageRowsLength * Number(more) },
      { $limit: pageRowsLength },
    ]).sort({ "matricule": 1 });

    return Response.json({ data: simplifyVehicules(vehicules) }, { status: 200 });
  } catch (err: any) {
    return Response.json({ error: true, message: "Erreur de chargement des donnees " + err.message } as ResponseType, { status: 500 });
  }
})

export default GET;