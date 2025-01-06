import Deplacement, { DeplacementType } from "@/models/Deplacement";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";

const POST = wrapperEndPoints(async (req: Request) => {
  try {
    const data = await req.json();

    const refData = typeof data.length === "undefined" ? [await createDeplacement(data)] : await Promise.all(data.map((row: any) => createDeplacement(row)));

    return Response.json({ error: false, message: "Cree avec succes", refData } as ResponseType, { status: 201 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 });
  }
})

const createDeplacement = async ({
  matricule, conductor, date, destination,
  kilometrage, qte_carburant, qte_lub,
  vidange, qte_carburant_ext, prix_carburant_ext, filter_changer,
}: DeplacementType) => {
  const deplacement = await Deplacement.findOne({ matricule, date: new NormalDate(date as any).parse() });
  if (deplacement) throw new Error(`Cet article existe deja, matricule: ${matricule}, date: ${date}`);

  try {
    const newDeplacement = await Deplacement.create({
      matricule, conductor, date: new NormalDate(date as any).parse(), destination,
      kilometrage, qte_carburant, qte_lub,
      vidange, qte_carburant_ext, prix_carburant_ext, filter_changer: (filter_changer as any) === "oui" ? true : undefined,
    });
    return { matricule, _id: newDeplacement._id }
  } catch (err: any) {
    throw new Error("Erreur lors de la creation de ce document: " + err.message);
  }
}

export default POST;
