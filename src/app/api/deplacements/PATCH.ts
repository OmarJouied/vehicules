import Deplacement, { DeplacementType } from "@/models/Deplacement";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";

const PATCH = wrapperEndPoints(async (req: Request) => {
  try {
    const data: DeplacementType[] = await req.json();
    await Promise.all(data.map(row => updateVehicule(row)));

    return Response.json({ error: false, message: "Mis a jour avec succes" } as ResponseType, { status: 202 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 });
  }
})

const updateVehicule = async ({
  matricule, conductor, date, destination,
  kilometrage, qte_carburant, qte_lub,
  vidange, qte_carburant_ext, prix_carburant_ext, filter_changer, _id
}: DeplacementType) => {
  const deplacement = await Deplacement.findById(_id);
  if (!deplacement) throw new Error("Ce document n'existe pas, matricule: " + matricule);

  Object.entries({
    matricule, conductor, date, destination,
    kilometrage, qte_carburant, qte_lub,
    vidange, qte_carburant_ext, prix_carburant_ext, filter_changer,
  }).forEach(item => {
    deplacement[item[0]] = item[0] === "date" ? new NormalDate(item[1] as any).parse() : item[0] === "filter_changer" ? (item[1] === "oui" ? true : undefined) : item[1];
  });

  try {
    await deplacement.save();
  } catch (error) {
    throw new Error("Erreur lors de la mise a jour du document " + error.message)
  }
}

export default PATCH;
