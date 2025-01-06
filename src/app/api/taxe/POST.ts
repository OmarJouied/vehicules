import Taxe, { TaxeType } from "@/models/Taxe";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";

const POST = wrapperEndPoints(async (req: Request) => {
  try {
    const data = await req.json();

    const refData = typeof data.length === "undefined" ? [await createTaxe(data)] : await Promise.all(data.map((row: any) => createTaxe(row)));

    return Response.json({ error: false, message: "Cree avec succes", refData } as ResponseType, { status: 201 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 })
  }
})

const createTaxe = async ({
  date, taxe_name, taxe_valeur
}: TaxeType) => {
  const vehicule = await Taxe.findOne({ taxe_name, date: new NormalDate(date as any).parse() });
  if (vehicule) throw new Error(`Cet article existe deja, taxe_name: ${taxe_name}, date: ${date}`);

  try {
    const newPrix = await Taxe.create({
      date: new NormalDate(date as any).parse(), taxe_name, taxe_valeur
    });

    return { taxe_name, _id: newPrix._id }
  } catch (err: any) {
    throw new Error("Erreur lors de la creation de ce document: " + err.message);
  }
}

export default POST;
