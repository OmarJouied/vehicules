import DepenseSupplementaire from "@/models/DepenseSupplementaire";
import Vehicule, { VehiculeType } from "@/models/Vehicule";
import VehiculeTypeCarburant from "@/models/VehiculeTypeCarburant";
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const PATCH = wrapperEndPoints(async (req: Request) => {
  try {
    const data: (VehiculeType & { type_carburant: string, vignte: number, taxe_tenage: number, assurance: number, visite_technique: number, carnet_metrologe: number, onssa: number, })[] = await req.json();
    await Promise.all(data.map(row => updateVehicule(row)));

    return Response.json({ error: false, message: "Mis a jour avec succes" } as ResponseType, { status: 202 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 });
  }
})

const updateVehicule = async ({
  matricule, affectation,
  dateachat, datemc, genre, marque, numchassis, poids,
  observation, prix_aquisiti, type, _id,

  type_carburant, vignte, taxe_tenage, assurance, visite_technique, carnet_metrologe, onssa
}: VehiculeType & { type_carburant: string, vignte: number, taxe_tenage: number, assurance: number, visite_technique: number, carnet_metrologe: number, onssa: number, }) => {
  const vehicule = await Vehicule.findById(_id);
  if (!vehicule) throw new Error("Ce document n'existe pas, pour modifier la matricule avec: " + matricule);

  Object.entries({
    matricule, affectation,
    dateachat, datemc, genre, marque, numchassis, poids,
    observation, prix_aquisiti, type,
  }).forEach(item => {
    vehicule[item[0]] = item[1];
  });

  await VehiculeTypeCarburant.findOneAndUpdate({ matricule }, { type_carburant }, { sort: { date: -1 } })
  const depenseSupplementaire = await DepenseSupplementaire.aggregate([
    {
      $match: {
        matricule
      }
    },
    {
      $group: {
        _id: "$type_depense",
        id: { $last: "$_id" }
      }
    },
  ]);
  await Promise.all((depenseSupplementaire.map(async (depense) => {
    await DepenseSupplementaire.findOneAndUpdate({ _id: depense.id }, { valeur: ({ vignte, taxe_tenage, assurance, visite_technique, carnet_metrologe, onssa } as any)[depense._id] })
  })))

  try {
    await vehicule.save();
  } catch (err: any) {
    throw new Error("Erreur lors de la mise a jour du document: " + err.message);
  }
}

export default PATCH;
