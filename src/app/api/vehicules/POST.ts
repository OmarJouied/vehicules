import DepenseSupplementaire from "@/models/DepenseSupplementaire";
import Vehicule, { VehiculeType } from "@/models/Vehicule";
import VehiculeTypeCarburant from "@/models/VehiculeTypeCarburant";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";

const POST = wrapperEndPoints(async (req: Request) => {
  try {
    const data = await req.json();

    const refData = typeof data.length === "undefined" ? [await createVehicule(data)] : await Promise.all(data.map((row: any) => createVehicule(row)));

    return Response.json({ error: false, message: "Cree avec succes", refData } as ResponseType, { status: 201 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 })
  }
})

const createVehicule = async ({
  matricule, affectation,
  dateachat, datemc, genre, marque, numchassis, poids,
  observation, prix_aquisiti, type,

  type_carburant, vignte, taxe_tenage, assurance, visite_technique, carnet_metrologe, onssa
}: VehiculeType & { type_carburant: string, vignte: number, taxe_tenage: number, assurance: number, visite_technique: number, carnet_metrologe: number, onssa: number, }) => {
  const vehicule = await Vehicule.findOne({ matricule });
  if (vehicule) throw new Error("Cet article existe deja, matricule: " + matricule);

  try {
    const newVehicule = await Vehicule.create({
      matricule, affectation,
      dateachat, datemc, genre, marque, numchassis, poids,
      observation, prix_aquisiti, type,
    });

    type_carburant && await VehiculeTypeCarburant.create({
      matricule, type_carburant, date: dateachat
    })
    console.log({ depenseSupplementaire: JSON.parse(JSON.stringify({ vignte, taxe_tenage, assurance, visite_technique, carnet_metrologe, onssa })) })
    await DepenseSupplementaire.insertMany(Object.entries(JSON.parse(JSON.stringify({ vignte, taxe_tenage, assurance, visite_technique, carnet_metrologe, onssa })))
      .map(item => ({ matricule, type_depense: item[0], valeur: item[1], date: new NormalDate(datemc as any).parse() })))

    return { matricule, _id: newVehicule._id }
  } catch {
    throw new Error("Erreur lors de la creation de ce document")
  }
}

export default POST;
