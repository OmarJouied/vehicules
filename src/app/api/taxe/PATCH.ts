import Taxe, { TaxeType } from "@/models/Taxe";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";

const PATCH = wrapperEndPoints(async (req: Request) => {
  try {
    const data: TaxeType[] = await req.json();
    await Promise.all(data.map((row: any) => updateTaxe(row)));

    return Response.json({ error: false, message: "Mis a jour avec succes" } as ResponseType, { status: 202 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 });
  }
})

const updateTaxe = async ({
  date, taxe_name, taxe_valeur, _id
}: TaxeType & { _id: string }) => {
  const taxe = await Taxe.findById(_id);
  if (!taxe) throw new Error("Ce document n'existe pas, pour modifier le taxe_name avec: " + taxe_name + " et " + date);

  Object.entries({
    date: new NormalDate(date as any).parse(), taxe_name, taxe_valeur
  }).forEach(item => {
    taxe[item[0]] = item[1];
  });

  try {
    await taxe.save();
  } catch (err: any) {
    throw new Error("Erreur lors de la mise a jour du document: " + err.message);
  }
}

export default PATCH;
