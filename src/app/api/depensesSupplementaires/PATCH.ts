import DepenseSupplementaire, { DepenseSupplementaireType } from "@/models/DepenseSupplementaire";
import ResponseType from "@/types/ResponseType";
import { wrapperEndPoints } from "@/utils/backend-functions";

const PATCH = wrapperEndPoints(async (req: Request) => {
  try {
    const data: DepenseSupplementaireType[] = await req.json();
    await Promise.all(data.map(row => updateDepenseSupplementaire(row)));

    return Response.json({ error: false, message: "Mis a jour avec succes" } as ResponseType, { status: 202 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 });
  }
})

const updateDepenseSupplementaire = async ({
  matricule, date, type_depense, valeur, _id
}: DepenseSupplementaireType) => {
  const vehicule = await DepenseSupplementaire.findById(_id);
  if (!vehicule) throw new Error("Ce document n'existe pas, pour modifier la matricule avec: " + matricule);

  Object.entries({
    matricule, date, type_depense, valeur,
  }).forEach(item => {
    vehicule[item[0]] = item[1];
  });

  try {
    await vehicule.save();
  } catch {
    throw new Error("Erreur lors de la mise a jour du document")
  }
}

export default PATCH;
