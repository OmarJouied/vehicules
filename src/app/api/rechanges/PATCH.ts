import Rechange, { RechangeType } from "@/models/Rechange";
import ResponseType from "@/types/ResponseType";
import { NormalDate, wrapperEndPoints } from "@/utils/backend-functions";

const PATCH = wrapperEndPoints(async (req: Request) => {
  try {
    const data: RechangeType[] = await req.json();
    await Promise.all(data.map(row => updateVehicule(row)));

    return Response.json({ error: false, message: "Mis a jour avec succes" } as ResponseType, { status: 202 });
  } catch ({ message }: any) {
    return Response.json({ error: true, message } as ResponseType, { status: 500 });
  }
})

const updateVehicule = async ({
  matricule, specification, destination, prix_unitere, qte, reference, date, n_bon, extern, _id
}: RechangeType) => {
  const rechange = await Rechange.findById(_id);
  if (!rechange) throw new Error("Ce document n'existe pas, n_bon: " + n_bon);

  Object.entries({
    matricule, specification, destination, prix_unitere, qte, reference, date: new NormalDate(date as any).parse(), n_bon, extern,
  }).forEach(item => {
    rechange[item[0]] = item[0] === "extern" ? (item[1] === "oui" ? true : undefined) : item[1];
  });

  try {
    await rechange.save();
  } catch (err: any) {
    throw new Error("Erreur lors de la mise a jour du document: " + err.message);
  }
}

export default PATCH;
