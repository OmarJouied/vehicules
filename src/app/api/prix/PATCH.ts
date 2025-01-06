import Prix, { PrixType } from "@/models/Prix";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";

const PATCH = wrapperEndPoints(async (req: Request) => {
  try {
    const data: PrixType[] = await req.json();
    await Promise.all(data.map((row: any) => updatePrix(row)));

    return Response.json({ error: false, message: "Mis a jour avec succes" } as ResponseType, { status: 202 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 });
  }
})

const updatePrix = async ({
  date, prix_name, prix_valeur, est_carburant, _id
}: PrixType & { _id: string }) => {
  const prix = await Prix.findById(_id);
  if (!prix) throw new Error("Ce document n'existe pas, pour modifier le prix_name avec: " + prix_name + " et " + date);

  Object.entries({
    date: new NormalDate(date as any).parse(), prix_name, prix_valeur, est_carburant
  }).forEach(item => {
    prix[item[0]] = item[1];
  });

  try {
    await prix.save();
  } catch (err: any) {
    throw new Error("Erreur lors de la mise a jour du document: " + err.message);
  }
}

export default PATCH;
