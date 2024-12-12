import DepenseSupplementaire, { DepenseSupplementaireType } from "@/models/DepenseSupplementaire";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";

const POST = wrapperEndPoints(async (req: Request) => {
  try {
    const data = await req.json();

    const refData = typeof data.length === "undefined" ? [await createDepenseSupplementaire(data)] : await Promise.all(data.map((row: any) => createDepenseSupplementaire(row)));

    return Response.json({ error: false, message: "Cree avec succes", refData } as ResponseType, { status: 201 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 })
  }
})

const createDepenseSupplementaire = async ({
  matricule, date, type_depense, valeur
}: DepenseSupplementaireType) => {
  const depenseSupplementaireType = await DepenseSupplementaire.findOne({ matricule, date: new NormalDate(date as unknown as string).parse(), type_depense });
  if (depenseSupplementaireType) throw new Error("Cet article existe deja, matricule: " + matricule);

  try {
    const newDepenseSupplementaire = await DepenseSupplementaire.create({
      matricule, date: new NormalDate(date as unknown as string).parse(), type_depense, valeur
    });

    return { matricule, _id: newDepenseSupplementaire._id }
  } catch {
    throw new Error("Erreur lors de la creation de ce document")
  }
}

export default POST;
